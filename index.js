const removeWithId = async (id) => {
    const element = document.getElementById(id);
    if (element) {
        element.remove();
    }
}

const createVideoSearch = async () => {
    const videoSearchDiv = document.createElement('div');
    videoSearchDiv.id = 'video-search';

    videoSearchDiv.innerHTML = `
        <h1>
            Video Searcher
        </h1>

        <label  for="minutes">
            Minutes:
        </label>
        <input type="number" id="minutes" min="3" max="59" value="3">

        <label for="seconds">
            Seconds:
        </label>
        <input type="number" id="seconds" min="0" max="59" value="0">

        <select id="type-selector">
            <option value="any">Any</option>
            <option value="months">Months</option>
            <option value="sponsors">Sponsors</option>
            <option value="roman_numerals">Roman Numerals</option>
            <option value="countries">Countries</option>
        </select>

        <select id="sponsor" style="display: none;">
            <option value="any">Any</option>
            <option value="pepsi">Pepsi</option>
            <option value="shell">Shell</option>
            <option value="starbucks">Starbucks</option>
        </select>

        <select id="country" style="display: none;">
            <option value="any">Any</option>
            <option value="iran">Iran</option>
            <option value="japan">Japan</option>
            <option value="peru">Peru</option>
            <option value="kenya">Kenya</option>
            <option value="spain">Spain</option>
            <option value="india">India</option>
        </select>

        <button id="search">Search</button>

        <label id="video-output"></label>

        <ul id="video-list" class="video-list"></ul>
    `;

    document.body.appendChild(videoSearchDiv);

    // WHYYYYYYYYY
    // Chrome Extensions cannot load .js from other files

    const minutesInput = document.getElementById('minutes');
    const secondsInput = document.getElementById('seconds');
    const typeInput = document.getElementById('type-selector');
    const sponsorInput = document.getElementById('sponsor');
    const countryInput = document.getElementById('country');
    const outputLabel = document.getElementById('video-output');
    const videoList = document.getElementById('video-list');

    const fetchJSONData = async () => {
        try {
        const response = await fetch('videos.json');
        const jsonData = await response.json();
        return jsonData;
        } catch (error) {
        console.error('Error fetching JSON data:', error);
        return null;
        }
    };

    const flattenData = (data) => {
        if (Array.isArray(data)) {
            return data;
        } else if (typeof data === 'object') {
            let result = [];
            for (let key in data) {
                result = result.concat(flattenData(data[key]));
            }
            return result;
        }
        return [];
    };

    const findVideo = async (totalSeconds, type, sponsor) => {
        videoList.innerHTML = ''; // Clear the list

        const jsonData = await fetchJSONData();
        if (!jsonData) return;

        let dataArray = [];
        switch (type) {
        case "any":
            dataArray = flattenData(jsonData);
            break;
        case "months":
            dataArray = jsonData.months;
            break;
        case "sponsors":
            switch (sponsor) {
            case "any":
                dataArray = Object.values(jsonData.sponsors).flat();
                break;
            case "pepsi":
                dataArray = jsonData.sponsors.pepsi;
                break;
            case "shell":
                dataArray = jsonData.sponsors.shell;
                break;
            case "starbucks":
                dataArray = jsonData.sponsors.starbucks;
                break;
            }
            break;
        case "roman_numerals":
            dataArray = jsonData.roman_numerals;
            break;
        case "countries":
            switch (countryInput.value) {
            case "any":
                dataArray = Object.values(jsonData.countries).flat();
                break;
            case "iran":
                dataArray = jsonData.countries.iran;
                break;
            case "japan":
                dataArray = jsonData.countries.japan;
                break;
            case "peru":
                dataArray = jsonData.countries.peru;
                break;
            case "kenya":
                dataArray = jsonData.countries.kenya;
                break;
            case "spain":
                dataArray = jsonData.countries.spain;
                break;
            case "india":
                dataArray = jsonData.countries.india;
                break;
            }
            break;
        }

        dataArray.filter(item => item.seconds === totalSeconds || item.seconds === totalSeconds + 1).forEach(item => {

            const li = document.createElement('li');
            videoList.appendChild(li);

            const videoLabel = document.createElement('h1');
            videoLabel.textContent = `youtu.be/${item.id}`;
            li.appendChild(videoLabel);

            const attomicValueLabel = document.createElement('label');
            attomicValueLabel.textContent = `\nThe atomic number is ${item.atomic_number}${item.xxxv ? " using XXXV" : ""}.`;
            li.appendChild(attomicValueLabel);

            const copyButton = document.createElement('button');
            copyButton.onclick = () => {
                navigator.clipboard.writeText(videoLabel.textContent);
            };
            copyButton.textContent = "Copy";
            li.appendChild(copyButton);
        });

        if (videoList.children.length > 0) {
        outputLabel.textContent = 'Video found!';
        } else {
        outputLabel.textContent = 'No videos found for the provided time.';
        }
        outputLabel.style.display = 'block';
    };

    typeInput.onchange = (e) => {
        sponsorInput.style.display = e.target.value === 'sponsors' ? 'inline-block' : 'none';
        countryInput.style.display = e.target.value === 'countries' ? 'inline-block' : 'none';
    };

    document.getElementById('search').onclick = async () => {
        const minutes = parseInt(minutesInput.value, 10);
        const seconds = parseInt(secondsInput.value, 10);
        const totalSeconds = minutes * 60 + seconds;
        const type = typeInput.value;
        const sponsor = sponsorInput.value || '';
        await findVideo(totalSeconds, type, sponsor);
    };
}

const createPuzzleSolver = async () => {
    const puzzleSolverDiv = document.createElement('div');
    puzzleSolverDiv.id = 'puzzle-solver';

    puzzleSolverDiv.innerHTML = `
        <h1>
            Chess Solver
        </h1>

        <label for="puzzle-id">
            Puzzle ID:
        </label>
        <input id="puzzle-id" type="number" min="0" max="192" value="0">

        <label id="puzzle-solution" class="puzzle-solution-label"></label>

        <button id="copy-solution">Copy</button>

        <img id="puzzle-img" src="https://neal.fun/password-game/chess/puzzle0.svg"></img>
    `;

    document.body.appendChild(puzzleSolverDiv);

    // AHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH
    
    const puzzleSolutionLabel = document.getElementById('puzzle-solution');
    const puzzleImage = document.getElementById('puzzle-img');

    const solutions = ['Nf6+', 'Qd5+', 'Qb8+', 'Qd8+', 'Qxg6+', 'Qxd7+', 'Qxf8+', 'Qd7+', 'Qg6+', 'Qxh6+', 'Qg4+', 'Qxh6+', 'Qg6+', 'Rg1+', 'Qxh5+', 'Ne7', 'Qc3+', 'Qf5+', 'Bf6+', 'Qc8+', 'Re8+', 'Rc1+', 'Bf4+', 'Ne6+', 'Qf8+', 'Bf5+', 'Qxc6+', 'Qxb8+', 'Qxd6+', 'Rd8+', 'Nd3+', 'Rxb6+', 'Qxf7+', 'Nf6+', 'Qe7+', 'Rg8+', 'Qxf7+', 'Be3+', 'Nh4+', 'Qxe6+', 'Qf8+', 'Qf6+', 'Nb5+', 'Qxh7+', 'Qxb7+', 'Qg1+', 'Bh6+', 'Rxf6+', 'Qxh6+', 'Bh5+', 'Nxd7+', 'Rxh2+', 'Bb5+', 'Rg8+', 'Qh8+', 'Bh5+', 'Qh7+', 'Qxh7+', 'Ne5+', 'Qxg7+', 'Rh8+', 'Rxh6+', 'Qxe8+', 'Rxe8+', 'Qxh6+', 'Qxh7+', 'Kh6', 'Be1+', 'Rxg7+', 'Qxg7+', 'Rg7', 'Bd6+', 'Ng6+', 'Qh3+', 'Rg1+', 'Qg1+', 'Rh8+', 'Rf6', 'Re7+', 'Qh6+', 'Qxh7+', 'Rf6+', 'Qf7+', 'Bb6+', 'Rxg6+', 'Qh8+', 'Rxh3+', 'Rxh7+', 'Nf5+', 'Rxf7+', 'Rf7+', 'f5+', 'Rh8+', 'Qxf2+', 'Qxf8+', 'Re8+', 'Rxf6+', 'Qh3+', 'Nf3', 'Qxe6+', 'Rg8+', 'Qe8+', 'Rxf5+', 'Qxh2+', 'Rxf8+', 'Rxg6+', 'Bf2+', 'Qxc3+', 'Nd4+', 'Qxh3+', 'Nf4+', 'Qg2+', 'Qxh7+', 'Qh2+', 'Qh1+', 'Qxh3+', 'Rxg7+', 'Qd8+', 'Rd8+', 'Rd8+', 'Nd5+', 'Rc8+', 'g5+', 'Rh4+', 'Ng6+', 'Qxe6+', 'Bf7+', 'Ne7+', 'Nh8+', 'Rxf1+', 'Bxg6+', 'Nxf7+', 'Re5+', 'Rf8+', 'Rxe6+', 'Rxh7+', 'Nxb7+', 'Qg8+', 'Qxh6+', 'Ra1+', 'Rh8+', 'Bg6+', 'Qd8+', 'Qh5+', 'Qxg6+', 'Qxa3+', 'Bg6+', 'Nf4+', 'Qxc3+', 'Ne6+', 'Nxf7+', 'Rxd8+', 'Ng3+', 'Re8+', 'Bxf3+', 'Rh2+', 'Re8+', 'Bh6', 'Qb5+', 'Qh6+', 'Rxh7+', 'Rxf7+', 'Rxf8+', 'Rh6', 'Bf5+', 'Rxh6+', 'Qe6+', 'Rxa7+', 'Rg2+', 'Qg4+', 'Qh1+', 'g4+', 'Qc6+', 'Rg8+', 'Bf6+', 'Qc6', 'Qf2+', 'Ne2+', 'Rh6+', 'Rc1+', 'Ne4+', 'Ng4', 'Rf7+', 'Qd8+', 'Rxh6+', 'Qg7+', 'Be5+', 'Rxh6+', 'Re4+', 'Nf7+', 'Rxh6+', 'Rf1+', 'Rg8+']

    puzzleSolutionLabel.textContent = solutions[0];

    document.getElementById('copy-solution').onclick = async () => {
        navigator.clipboard.writeText(puzzleSolutionLabel.textContent);
    }

    document.getElementById('puzzle-id').onchange = async (e) => {
        if (e.target.value < 0)
        {
            e.target.value = 0;
        } else if (e.target.value > 192) {
            e.target.value = 192;
        }

        puzzleSolutionLabel.textContent = solutions[e.target.value];
        puzzleImage.src = `https://neal.fun/password-game/chess/puzzle${e.target.value}.svg`;
    };
}

const createInputValidator = async () => {
    const inputSolverDiv = document.createElement('div');
    inputSolverDiv.id = 'input-validator';

    inputSolverDiv.innerHTML = `
        <h1>
            Input Validator
        </h1>
        <label>
            Enter your input:
        </label>

        <div id="input" class="input" contenteditable="true" translate="no" spellcheck="false"></div>

        <button id="validate" class="validate">Validate</button>

        <ul id="failed-result" class="rules-list"></ul>
        <ul id="passed-result" class="rules-list"></ul>
    `;

    document.body.appendChild(inputSolverDiv);

    const inputText = document.getElementById('input');
    const failedResultList = document.getElementById('failed-result');
    const passedResultList = document.getElementById('passed-result');
    const months = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
    const captchas = ["2b827", "2cg58", "2g783", "2x7bm", "2ycn8", "3bd8f", "3bfnd", "3den6", "3ebnn", "3nw7w", "3ny45", "3p4nn", "3pe4g", "3w2bw", "4cn7b", "4dgf7", "5n245", "5ng6e", "6dd2y", "6e6pn", "6gnm3", "6p7gx", "6xxdx", "7gmf3", "7wnpm", "7wyp4", "7xd5m", "7y2x4", "8c23f", "8gecm", "8n5pn", "8pfxx", "8w754", "8y63f", "25egp", "28x47", "33p4e", "34pcn", "44xe8", "47e4p", "53wb8", "58b5m", "64m82", "66wp5", "73mnx", "74eyg", "75pfw", "77n6g", "88y52", "264m5", "387g2", "573d8", "52447", "b5nmm", "b6f2p", "b28g8", "b84xc", "bbymy", "bdg84", "be3bp", "bgd4m", "bnc2f", "bny4w", "bw6n6", "bw44w", "c2fb7", "c2pg6", "c86md", "cdcb3", "cen55", "cfc56", "cffp4", "cgcgb", "cnwyc", "cpc8c", "d6fcn", "d22bd", "d378n", "dbex3", "dbfen", "dd5w5", "de45x", "dn5df", "dn26n", "dpbyd", "e7x45", "ebcbx", "ec6pm", "ecd4w", "en4n4", "f6ne5", "f75cx", "fc6xb", "g78gn", "gc277", "gfp54", "ggd7m", "gnc3n", "gny6b", "gw53m", "m67b3", "m3588", "mgw3n", "mm3nn", "mp7wp", "myc3c", "n2by7", "n3ffn", "n373n", "nbcgb", "nbf8m", "nbfx5", "nbp3e", "nc4yg", "ndyfe", "nf8b8", "ng2gw", "nnfx3", "nnn5p", "nnn57", "ny8np", "p2m6n", "p4pde", "pcede", "pdyc8", "pf5ng", "pm363", "pmf5w", "w8f36", "w52fn", "wc2bd", "wce5n", "wg625", "x3fwf", "x4f7g", "x4gg5", "x6b5m", "x38fn", "xbcbx", "xe8xm", "xgcxy", "xngxc", "y4n6m", "y5dpp", "y5w28", "y7mnm", "y7x8p", "yd755", "yf424"];
    const countries = ["Australia", "Belarus", "Belgium", "Bulgaria", "Cambodia", "Canada", "Chile", "Canada", "Chile", "Colombia", "Croatia", "Denmark", "Finland", "Georgia", "Germany", "Hungary", "Indonesia", "Israel", "Kenya", "Liberia", "Madagascar", "New Zealand", "Norway", "Philippines", "Portugal", "Romania", "Russia", "Slovenia", "Venezuela", "Albania", "Belgium", "Colombia", "Croatia", "Germany", "Ghana", "India", "Indonesia", "Iran", "Italy", "Japan", "Jordan", "Kenya", "Latvia", "Lithuania", "Malaysia", "Netherlands", "New Zealand", "Nigeria", "Poland", "Singapore", "Spain", "Sweden"];
    const solutions = ['Nf6+', 'Qd5+', 'Qb8+', 'Qd8+', 'Qxg6+', 'Qxd7+', 'Qxf8+', 'Qd7+', 'Qg6+', 'Qxh6+', 'Qg4+', 'Qxh6+', 'Qg6+', 'Rg1+', 'Qxh5+', 'Ne7', 'Qc3+', 'Qf5+', 'Bf6+', 'Qc8+', 'Re8+', 'Rc1+', 'Bf4+', 'Ne6+', 'Qf8+', 'Bf5+', 'Qxc6+', 'Qxb8+', 'Qxd6+', 'Rd8+', 'Nd3+', 'Rxb6+', 'Qxf7+', 'Nf6+', 'Qe7+', 'Rg8+', 'Qxf7+', 'Be3+', 'Nh4+', 'Qxe6+', 'Qf8+', 'Qf6+', 'Nb5+', 'Qxh7+', 'Qxb7+', 'Qg1+', 'Bh6+', 'Rxf6+', 'Qxh6+', 'Bh5+', 'Nxd7+', 'Rxh2+', 'Bb5+', 'Rg8+', 'Qh8+', 'Bh5+', 'Qh7+', 'Qxh7+', 'Ne5+', 'Qxg7+', 'Rh8+', 'Rxh6+', 'Qxe8+', 'Rxe8+', 'Qxh6+', 'Qxh7+', 'Kh6', 'Be1+', 'Rxg7+', 'Qxg7+', 'Rg7', 'Bd6+', 'Ng6+', 'Qh3+', 'Rg1+', 'Qg1+', 'Rh8+', 'Rf6', 'Re7+', 'Qh6+', 'Qxh7+', 'Rf6+', 'Qf7+', 'Bb6+', 'Rxg6+', 'Qh8+', 'Rxh3+', 'Rxh7+', 'Nf5+', 'Rxf7+', 'Rf7+', 'f5+', 'Rh8+', 'Qxf2+', 'Qxf8+', 'Re8+', 'Rxf6+', 'Qh3+', 'Nf3', 'Qxe6+', 'Rg8+', 'Qe8+', 'Rxf5+', 'Qxh2+', 'Rxf8+', 'Rxg6+', 'Bf2+', 'Qxc3+', 'Nd4+', 'Qxh3+', 'Nf4+', 'Qg2+', 'Qxh7+', 'Qh2+', 'Qh1+', 'Qxh3+', 'Rxg7+', 'Qd8+', 'Rd8+', 'Rd8+', 'Nd5+', 'Rc8+', 'g5+', 'Rh4+', 'Ng6+', 'Qxe6+', 'Bf7+', 'Ne7+', 'Nh8+', 'Rxf1+', 'Bxg6+', 'Nxf7+', 'Re5+', 'Rf8+', 'Rxe6+', 'Rxh7+', 'Nxb7+', 'Qg8+', 'Qxh6+', 'Ra1+', 'Rh8+', 'Bg6+', 'Qd8+', 'Qh5+', 'Qxg6+', 'Qxa3+', 'Bg6+', 'Nf4+', 'Qxc3+', 'Ne6+', 'Nxf7+', 'Rxd8+', 'Ng3+', 'Re8+', 'Bxf3+', 'Rh2+', 'Re8+', 'Bh6', 'Qb5+', 'Qh6+', 'Rxh7+', 'Rxf7+', 'Rxf8+', 'Rh6', 'Bf5+', 'Rxh6+', 'Qe6+', 'Rxa7+', 'Rg2+', 'Qg4+', 'Qh1+', 'g4+', 'Qc6+', 'Rg8+', 'Bf6+', 'Qc6', 'Qf2+', 'Ne2+', 'Rh6+', 'Rc1+', 'Ne4+', 'Ng4', 'Rf7+', 'Qd8+', 'Rxh6+', 'Qg7+', 'Be5+', 'Rxh6+', 'Re4+', 'Nf7+', 'Rxh6+', 'Rf1+', 'Rg8+']
    
    const getWordleAnswer = async () => {
        const date = new Date();
        const dateText = [date.getFullYear().toString().padStart(2, '0'), (date.getMonth() + 1).toString().padStart(2, '0'), date.getDate().toString().padStart(2, '0')].join('-');
        return await fetch(`https://neal.fun/api/password-game/wordle?date=${dateText}`)
        .then(async response => {
            const data = await response.json();
            return data.answer ? data.answer.toLowerCase() : '';
        })
        .catch(error => {
            return null;
        });
    }

    const getMoonPhase = (date = new Date()) => {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();

        const julianDate = getJulianDate(year, month, day) + (date.getHours() - 12) / 24;

        return 0.5 * (1 - Math.cos(2 * Math.PI * getMoonAge(julianDate) / 29.53059));
    }
    
    const getJulianDate = (year, month, day) => {
        if (month <= 2) {
            year--;
            month += 12;
        }

        const a = Math.floor(year / 100);
        const b = 2 - a + Math.floor(a / 4);

        return (
            Math.floor(365.25 * (year + 4716)) +
            Math.floor(30.6001 * (month + 1)) +
            day +
            b -
            1524.5
        );
    }
    
    const getMoonAge = (julianDate) => (julianDate - Math.floor(julianDate) + 0.5) * 29.53059;
    
    const moonPhase = () => {
        const todaysMoonPhase = getMoonPhase();
        const tomorrowsMoonPhase = getMoonPhase(new Date(new Date().getTime() + 24 * 60 * 60 * 1000));

        return (
            tomorrowsMoonPhase <= .25 ? ["🌓", "🌗", "🌛", "🌜"] :
            tomorrowsMoonPhase <= .5 ? ["🌕", "🌝"] :
            tomorrowsMoonPhase <= .75 ? ["🌓", "🌗", "🌛", "🌜"] :
            tomorrowsMoonPhase <= 1 ? ["🌑", "🌚"] :
            todaysMoonPhase <= .25 ? ["🌒", "🌘"] :
            todaysMoonPhase <= .5 || todaysMoonPhase <= .75 ? ["🌔", "🌖"] :
            ["🌒", "🌘"]
        );
    };
    
    const isPrime = (number) => {
    if (number <= 1) return false;

    for (let i = 2; i <= Math.sqrt(number); i++) {
        if (number % i === 0) return false;
    }

    return true;
    }

    const wordleAnswer = await getWordleAnswer();

    document.getElementById('validate').onclick = async () => {
        const [passedRule5, total, passedRule9, roman_numerals, passedRule18, atomicTotal, twoLetterAttomic] = await validateInput(inputText.textContent);

        const rules = await [
            {
                desc: `Your password must be at least 5 characters.\nCurrently ${inputText.textContent.length} long.`,
                passed: inputText.textContent.length >= 5
            }, {
                desc: 'Your password must include a number.',
                passed: /\d/.test(inputText.textContent)
            }, {
                desc: 'Your password must include an uppercase letter.',
                passed: /[A-Z]/.test(inputText.textContent)
            }, {
                desc: 'Your password must include a special character.',
                passed: /[^a-zA-Z0-9]/.test(inputText.textContent)
            }, {
                desc: `The digits in your password must add up to 25.\nTotal number is ${total}`,
                passed: passedRule5
            }, {
                desc: 'Your password must include a month of the year.',
                passed: new RegExp(months.join('|'), 'i').test(inputText.textContent)
            }, {
                desc: 'Your password must include a roman numeral.',
                passed: roman_numerals !== 0
            }, {
                desc: `Your password must include one of our sponsors.\nThe sponsors are: pepsi, starbucks and shell.`,
                passed: /pepsi|starbucks|shell/i.test(inputText.textContent)
            }, {
                desc: `The Roman numerals in your password should multiply to 35.\nCurrently the total is ${roman_numerals}.`,
                passed: passedRule9
            }, {
                desc: 'Your password must include a CAPTCHA',
                passed: new RegExp(captchas.join('|'), 'i').test(inputText.textContent)
            }, {
                desc: `Your password must include today's wordle answer.\n${wordleAnswer === null ? "Couldn't find wordle answer because there is no internet." : `The current wordle answer is: ${wordleAnswer}`}.`,
                passed: new RegExp(wordleAnswer, 'i').test(inputText.textContent)
            }, {
                desc: 'Your password must include a two letter symbol from the periodic table.',
                passed: twoLetterAttomic
            }, {
                desc: `Your password must include the current phase of the moon as an emoji.\nThe current moon phase is ${moonPhase().join(', ')}.`,
                passed: new RegExp(moonPhase().join('|')).test(inputText.textContent)
            }, {
                desc: 'Your password must include a name of a country.',
                passed: new RegExp(countries.join('|'), 'i').test(inputText.textContent)
            }, {
                desc: 'Your password must include a leap year.',
                passed: inputText.textContent.match(/\d+/g)?.some(number => 
                    number % 4 === 0
                    && number % 100 !== 0
                    || number % 400 === 0
                ) ?? false
            }, {
                desc: 'Your password must include a best move in algeraic chess notation',
                passed: new RegExp(solutions.join('|')).test(inputText.textContent)
            }, {
                desc: "🥚 ← This is my chicken Paul. He hasn't hatched yet, please put him in your password and keep him safe.",
                passed: /🥚|🐔/.test(inputText.textContent)
            }, {
                desc: `The elements in your password must have atomic numbers that add up to 200.\nCurrently the attomic total is ${atomicTotal}.`,
                passed: passedRule18
            }, {
                desc: 'All vowels in your password must be bolded.',
                passed: ![...inputText.childNodes].some(node => {
                    if (node.nodeType === Node.TEXT_NODE) {
                      const boldValue = window.getComputedStyle(node.parentElement)['font-weight'];
                      if (node.textContent.match(/[aeiouy]/i)) {
                          return boldValue !== 'bold' || boldValue !== '700';
                      }
                    }
                    return false;
                  }),
                  hideRule: true
            }, {
                desc: 'Oh no! Your password is on fire. Quick, put it out!',
                passed: !inputText.textContent.match('🔥')
            }, {
                desc: 'Your password is not strong enough 🏋️‍♂️',
                passed: inputText.textContent.matchAll('🏋️‍♂️').length >= 3
            }, {
                desc: 'Your password must contain one of the following affirmations:\ni am loved, i am worthy, i am enough',
                passed: inputText.textContent.match(/i am loved|i am worthy|i am enough/i)
            }, {
                desc: "Paul has hatched! Please don't forget to feed him, he eats three 🐛 every minute.",
                passed: inputText.textContent.match('🐔')
            }, {
                desc: 'Your password must include the URL of a youtube video.',
                passed: inputText.textContent.match(/(youtube\.com\/watch\?v=|youtu\.be\/)[0-9A-Za-z_-]{11}/)
            }, {
                desc: `Your password must have 2 letters missing.\nCurrently missing characters: ${[...'abcdefghijklmnopqrstuvwxyz'].filter(letter => !inputText.textContent.includes(letter)).join(', ')}`,
                passed: [...'abcdefghijklmnopqrstuvwxyz'].filter(letter => !inputText.textContent.includes(letter)).length >= 2
            }, {
                desc: 'Your password must contain twice as many italic characters as bold.',
                passed: (inputText.textContent.match(/<b>[^<>]*?<\/b>/g) || []).length * 2 <= (inputText.textContent.match(/<i>[^<>]*?<\/i>/g) || []).length,
                hideRule: true
            }, {
                desc: 'At least 30% of your password must be in the Wingdings font.',
                passed: ([...inputText.childNodes].map(node => {
                    if (node.nodeType === Node.TEXT_NODE) {
                      const fontFamilyValue = window.getComputedStyle(node.parentElement)['font-family'];
                      if (fontFamilyValue.match(/wingdings/i)) {
                        return node.textContent;
                      }
                    }
                  }) ?? '').length / inputText.textContent.length >= 0.3,
                  hideRule: true
            }, {
                desc: 'Your password must include a color in hex.',
                passed: inputText.textContent.match(/#[0-9a-f]{6}/i)
            }, {
                desc: 'All roman numerals must be in Times New Roman.',
                passed: ![...inputText.childNodes].some(node => {
                    if (node.nodeType === Node.TEXT_NODE) {
                        const fontFamilyValue = window.getComputedStyle(node.parentElement)['font-family'];
                        if (node.textContent.match(/M|D|C|L|X|V|I/)) {
                            return fontFamilyValue.match(/New Times Roman/i);
                        }
                    }
                    return false;
                  }),
                  hideRule: true
            }, {
                desc: 'The font size of every digit must be equal to its square.',
                passed: false,
                hideRule: true
            }, {
                desc: 'Every instance of the same letter must have a different font size.',
                passed: false,
                hideRule: true
            }, {
                desc: 'Your password must include the length of your password.',
                passed: inputText.textContent.includes(inputText.textContent.length.toString())
            }, {
                desc: 'The length of your password must be a prime number',
                passed: isPrime(inputText.textContent.length)
            }, {
                desc: "Uhhh let's skip this one.",
                passed: true
            }, {
                desc: 'Your password must include the current time.',
                passed: input.textContent.includes(new Date().toLocaleString(
                    "en-US",
                    {
                        hour: "numeric",
                        minute: "numeric",
                        hour12: true
                    }
                ).split(" ")[0])
            }
        ];

        passedResultList.innerHTML = "";
        failedResultList.innerHTML = "";
        
        rules.forEach((rule, i) => {
            // All rules with "hideRule" aren't supported/broken
            if (!rule.hideRule) {
                createRuleItem(
                    i + 1,
                    rule.desc,
                    rule.passed
                )
            }
        });
    }

    const createRuleItem = async (ruleNumber, ruleDescription, passed) => {
        const li = document.createElement('li');
        li.className = passed ? 'passed-rule' : 'failed-rule';
        (passed ? passedResultList : failedResultList).appendChild(li);

        const ruleTitleLabel = document.createElement('label'); 
        ruleTitleLabel.textContent = "Rule " + ruleNumber;
        li.appendChild(ruleTitleLabel);

        const ruleDescriptionSpan = document.createElement('span');
        ruleDescriptionSpan.innerHTML = ruleDescription.replace('\n', '<br>');
        li.appendChild(ruleDescriptionSpan);
    }

    const validateInput = async (input) => {
        const periodicElements = new Map([
          ['H', 1], ['He', 2], ['Li', 3], ['Be', 4], ['B', 5], ['C', 6], ['N', 7], ['O', 8],
          ['F', 9], ['Ne', 10], ['Na', 11], ['Mg', 12], ['Al', 13], ['Si', 14], ['P', 15], ['S', 16],
          ['Cl', 17], ['Ar', 18], ['K', 19], ['Ca', 20], ['Sc', 21], ['Ti', 22], ['V', 23], ['Cr', 24],
          ['Mn', 25], ['Fe', 26], ['Co', 27], ['Ni', 28], ['Cu', 29], ['Zn', 30], ['Ga', 31], ['Ge', 32],
          ['As', 33], ['Se', 34], ['Br', 35], ['Kr', 36], ['Rb', 37], ['Sr', 38], ['Y', 39], ['Zr', 40],
          ['Nb', 41], ['Mo', 42], ['Tc', 43], ['Ru', 44], ['Rh', 45], ['Pd', 46], ['Ag', 47], ['Cd', 48],
          ['In', 49], ['Sn', 50], ['Sb', 51], ['Te', 52], ['I', 53], ['Xe', 54], ['Cs', 55], ['Ba', 56],
          ['La', 57], ['Ce', 58], ['Pr', 59], ['Nd', 60], ['Pm', 61], ['Sm', 62], ['Eu', 63], ['Gd', 64],
          ['Tb', 65], ['Dy', 66], ['Ho', 67], ['Er', 68], ['Tm', 69], ['Yb', 70], ['Lu', 71], ['Hf', 72],
          ['Ta', 73], ['W', 74], ['Re', 75], ['Os', 76], ['Ir', 77], ['Pt', 78], ['Au', 79], ['Hg', 80],
          ['Tl', 81], ['Pb', 82], ['Bi', 83], ['Po', 84], ['At', 85], ['Rn', 86], ['Fr', 87], ['Ra', 88],
          ['Ac', 89], ['Th', 90], ['Pa', 91], ['U', 92], ['Np', 93], ['Pu', 94], ['Am', 95], ['Cm', 96],
          ['Bk', 97], ['Cf', 98], ['Es', 99], ['Fm', 100], ['Md', 101], ['No', 102], ['Lr', 103], ['Rf', 104],
          ['Db', 105], ['Sg', 106], ['Bh', 107], ['Hs', 108], ['Mt', 109], ['Ds', 110], ['Rg', 111], ['Cn', 112],
          ['Nh', 113], ['Fl', 114], ['Mc', 115], ['Lv', 116], ['Ts', 117], ['Og', 118]
        ]);
  
        const romanNumerals = new Map([['I', 1], ['V', 5], ['X', 10], ['L', 50], ['C', 100], ['D', 500], ['M', 1000]]);
  
        let twoLetterAttomic = false;
        let atomicTotal = 0;
        let romanNumeralValues = [];
        let lastRoman = false;
        let total = 0;
  
        for (let i = 0; i < input.length; i++) {
          const romanValue = romanNumerals.get(input[i]);
  
          if (romanValue !== undefined) {
            if (lastRoman) {
              const lastRomanChar = romanNumeralValues[romanNumeralValues.length - 1][0].charAt(romanNumeralValues[romanNumeralValues.length - 1][0].length - 1);
              const lastRomanValue = romanNumerals.get(lastRomanChar);
              if (lastRomanValue < romanValue) {
                romanNumeralValues.push([input[i], romanValue]);
              } else {
                romanNumeralValues[romanNumeralValues.length - 1][0] += input[i];
                romanNumeralValues[romanNumeralValues.length - 1][1] += romanValue;
              }
            } else {
              romanNumeralValues.push([input[i], romanValue]);
            }
            lastRoman = true;
          } else {
            lastRoman = false;
          }
  
          const digit = parseInt(input[i], 10);
          if (!isNaN(digit)) {
            total += digit;
          }

          let element = input[i];
          let atomicNumber = undefined;
  
          if (i < input.length - 1) {
            element += input[i+1];
            atomicNumber = periodicElements.get(element);
            if (atomicNumber) {
              atomicTotal += atomicNumber;
              twoLetterAttomic = true;
            } else element = element[0];
          }
          
          if (!atomicNumber) {
            atomicNumber = periodicElements.get(element);
            if (atomicNumber) {
                atomicTotal += atomicNumber;
            }
          }
        }
  
        let romanNumeralsTotal = 0;
        if (romanNumeralValues.length > 0) {
            romanNumeralsTotal = 1;
            for (let i = 0; i < romanNumeralValues.length; i++) {
            romanNumeralsTotal *= romanNumeralValues[i][1];
            }
        }

        return [total == 25, total, romanNumeralsTotal == 35, romanNumeralsTotal, atomicTotal == 200, atomicTotal, twoLetterAttomic];
    }
}

createVideoSearch();

let oldValue = 'video-search';
document.getElementById('solver').onchange = async (e) => {
    switch (oldValue) {
        case 'video-search':
            removeWithId('video-search');
            break;
        case 'chess-solver':
            removeWithId('puzzle-solver');
            break;
        case 'input-validator':
            removeWithId('input-validator');
            break;
    }

    switch (e.target.value) {
        case 'video-search':
            createVideoSearch();
            break;
        case 'chess-solver':
            createPuzzleSolver();
            break;
        case 'input-validator':
            createInputValidator();
            break;
    }
    
    oldValue = e.target.value;
};