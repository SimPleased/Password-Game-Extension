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
                passed: new RegExp(moonPhase().join('|')).test(inputText.textContent),
                hideRule: true
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

const createGeoguessr = async () => {
    const geoguessrDiv = document.createElement('div');
    geoguessrDiv.id = 'geoguessr';

    geoguessrDiv.innerHTML = `
        <h1>
            Find Country
        </h1>

        <label id="current-country">
            Australia
        </label>
        
        <button id="copy-country">Copy</button>

        <br>

        <button id="previous-country">Previous</button>
        <button id="next-country">Next</button>

        <div class="geoguessr-embed-wrapper">
            <iframe id="geoguessr-embed" class="geoguessr-embed" src="https://www.google.com/maps/embed?pb=!4v1686332510022!6m8!1m7!1sCAoSLEFGMVFpcE4zNEtxOUROWGF1MmZzRVgycFhETFpmQ0lDbldhUVBrdS03RlF1!2m2!1d-25.35068396746521!2d131.0463222711639!3f264.26!4f4.340000000000003!5f0.7820865974627469">
        </div>
`;

    document.body.appendChild(geoguessrDiv);

    const countryLabel = document.getElementById('current-country');
    const countryEmbed = document.getElementById('geoguessr-embed');


    let currentCountryIndex = 0;

    const countries = [{
        name: "Australia",
        link: "https://www.google.com/maps/@-25.350684,131.0463223,3a,75y,264.26h,94.34t/data=!3m8!1e1!3m6!1sAF1QipN34Kq9DNXau2fsEX2pXDLZfCICnWaQPku-7FQu!2e10!3e11!6shttps:%2F%2Flh5.googleusercontent.com%2Fp%2FAF1QipN34Kq9DNXau2fsEX2pXDLZfCICnWaQPku-7FQu%3Dw203-h100-k-no-pi-12.154341-ya290.7717-ro-0-fo100!7i10600!8i5300?entry=ttu",
        embed: "https://www.google.com/maps/embed?pb=!4v1686332510022!6m8!1m7!1sCAoSLEFGMVFpcE4zNEtxOUROWGF1MmZzRVgycFhETFpmQ0lDbldhUVBrdS03RlF1!2m2!1d-25.35068396746521!2d131.0463222711639!3f264.26!4f4.340000000000003!5f0.7820865974627469"
    }, {
        name: "Belarus",
        link: "https://www.google.com/maps/place/Muzey+Istorii+Teatral'noy+I+Muzykal'noy+Kul'tury/@53.9054798,27.5601444,3a,90y,49.35h,96.51t/data=!3m6!1e1!3m4!1ss88rdBq5UiYKvp6ojwA7_Q!2e0!7i13312!8i6656!4m17!1m9!3m8!1s0x46da2584e2ad4881:0xa1d181ec8c10!2sBelarus!3b1!8m2!3d53.709807!4d27.953389!10e5!16zL20vMDE2M3Y!3m6!1s0x46dbcfeab3ddf76b:0x4102441cff9e1bc1!8m2!3d53.9051914!4d27.5595092!10e5!16s%2Fg%2F1hc54q1j2?entry=ttu",
        embed: "https://www.google.com/maps/embed?pb=!4v1686332520258!6m8!1m7!1ss88rdBq5UiYKvp6ojwA7_Q!2m2!1d53.90547982613528!2d27.56014437433606!3f49.35!4f6.510000000000005!5f0.4000000000000002"
    }, {
        name: "Belgium",
        link: "https://www.google.com/maps/@51.2180796,4.4150183,3a,75y,286.45h,100.66t/data=!3m6!1e1!3m4!1srkFY-BkTJ0-2z2hWjwMHLg!2e0!7i13312!8i6656?entry=ttu",
        embed: "https://www.google.com/maps/embed?pb=!4v1686332523961!6m8!1m7!1srkFY-BkTJ0-2z2hWjwMHLg!2m2!1d51.21807961391364!2d4.41501826373772!3f286.45!4f10.659999999999997!5f0.7820865974627469"
    }, {
        name: "Bulgaria",
        link: "https://www.google.com/maps/@42.1494591,24.7477184,3a,90y,296.84h,97.19t/data=!3m7!1e1!3m5!1sncjaflFhux3cCQ9oVdgzTg!2e0!6shttps:%2F%2Fstreetviewpixels-pa.googleapis.com%2Fv1%2Fthumbnail%3Fpanoid%3DncjaflFhux3cCQ9oVdgzTg%26cb_client%3Dmaps_sv.tactile.gps%26w%3D203%26h%3D100%26yaw%3D359.54242%26pitch%3D0%26thumbfov%3D100!7i13312!8i6656?entry=ttu",
        embed: "https://www.google.com/maps/embed?pb=!4v1686332538942!6m8!1m7!1sncjaflFhux3cCQ9oVdgzTg!2m2!1d42.14945905626361!2d24.74771841789687!3f296.84!4f7.189999999999998!5f0.4000000000000002"
    }, {
        name: "Cambodia",
        link: "https://www.google.com/maps/@11.5566079,104.9353968,3a,90y,258.58h,101.78t/data=!3m8!1e1!3m6!1sAF1QipMzT_CJp2TIuk4O2ke9ghUioKfm7ccGBuSJk7ub!2e10!3e11!6shttps:%2F%2Flh5.googleusercontent.com%2Fp%2FAF1QipMzT_CJp2TIuk4O2ke9ghUioKfm7ccGBuSJk7ub%3Dw203-h100-k-no-pi-0-ya152.46721-ro-0-fo100!7i6080!8i3040?entry=ttu",
        embed: "https://www.google.com/maps/embed?pb=!4v1686332542719!6m8!1m7!1sCAoSLEFGMVFpcE16VF9DSnAyVEl1azRPMmtlOWdoVWlvS2ZtN2NjR0J1U0prN3Vi!2m2!1d11.5566079!2d104.9353968!3f258.58!4f11.780000000000001!5f0.4000000000000002"
    }, {
        name: "Canada",
        link: "https://www.google.com/maps/@60.1872492,-134.6889013,3a,75y,125.82h,79.67t/data=!3m8!1e1!3m6!1sAF1QipNvWQOsqWlXPBfQjb3nZyw7BLWeyWUgKrSA8DIl!2e10!3e11!6shttps:%2F%2Flh5.googleusercontent.com%2Fp%2FAF1QipNvWQOsqWlXPBfQjb3nZyw7BLWeyWUgKrSA8DIl%3Dw203-h100-k-no-pi-0.112540185-ya59.915157-ro-0-fo100!7i13970!8i6985?entry=ttu",
        embed: "https://www.google.com/maps/embed?pb=!4v1686332551821!6m8!1m7!1sCAoSLEFGMVFpcE52V1FPc3FXbFhQQmZRamIzblp5dzdCTFdleVdVZ0tyU0E4REls!2m2!1d60.18724916!2d-134.6889013!3f125.82!4f-10.329999999999998!5f0.7820865974627469"
    }, {
        name: "Chile",
        link: "https://www.google.com/maps/@-42.3318332,-73.3751597,2a,75y,350.28h,110.42t/data=!3m6!1e1!3m4!1sqIYR4B95XigAAAQpm86PUg!2e0!7i13312!8i6656?entry=ttu",
        embed: "https://www.google.com/maps/embed?pb=!4v1686332554989!6m8!1m7!1sqIYR4B95XigAAAQpm86PUg!2m2!1d-42.33183318859179!2d-73.37515973422785!3f350.28!4f20.42!5f0.7820865974627469"
    }, {
        name: "Colombia",
        link: "https://www.google.com/maps/@4.5985391,-74.0681066,3a,75y,280.78h,87.12t/data=!3m7!1e1!3m5!1sZbG88ECu5M1YVxcm7pp78A!2e0!6shttps:%2F%2Fstreetviewpixels-pa.googleapis.com%2Fv1%2Fthumbnail%3Fpanoid%3DZbG88ECu5M1YVxcm7pp78A%26cb_client%3Dmaps_sv.tactile.gps%26w%3D203%26h%3D100%26yaw%3D343.3648%26pitch%3D0%26thumbfov%3D100!7i13312!8i6656?entry=ttu",
        embed: "https://www.google.com/maps/embed?pb=!4v1686332561586!6m8!1m7!1sZbG88ECu5M1YVxcm7pp78A!2m2!1d4.598539130476504!2d-74.06810659286658!3f280.78!4f-2.8799999999999955!5f0.7820865974627469"
    }, {
        name: "Croatia",
        link: "https://www.google.com/maps/@45.0819259,13.6347638,3a,90y,95.03h,90.52t/data=!3m8!1e1!3m6!1sAF1QipOg1gfcv3mZuo3c1EL38zFiBOosvH7a-Luk2tni!2e10!3e11!6shttps:%2F%2Flh5.googleusercontent.com%2Fp%2FAF1QipOg1gfcv3mZuo3c1EL38zFiBOosvH7a-Luk2tni%3Dw203-h100-k-no-pi-0-ya47.37348-ro-0-fo100!7i7500!8i3750?entry=ttu",
        embed: "https://www.google.com/maps/embed?pb=!4v1686332568377!6m8!1m7!1sCAoSLEFGMVFpcE9nMWdmY3YzbVp1bzNjMUVMMzh6RmlCT29zdkg3YS1MdWsydG5p!2m2!1d45.08192591163372!2d13.63476375882529!3f95.03!4f0.519999999999996!5f0.4000000000000002"
    }, {
        name: "Denmark",
        link: "https://www.google.com/maps/@56.6525516,8.5262593,3a,75y,69.18h,93.33t/data=!3m6!1e1!3m4!1sJo2m04ymc8xFmGFYNH2Tyw!2e0!7i16384!8i8192?entry=ttu",
        embed: "https://www.google.com/maps/embed?pb=!4v1686332575021!6m8!1m7!1sJo2m04ymc8xFmGFYNH2Tyw!2m2!1d56.65255161375055!2d8.52625930536295!3f69.18!4f3.3299999999999983!5f0.7820865974627469"
    }, {
        name: "Finland",
        link: "https://www.google.com/maps/@60.1378835,24.990532,3a,75y,265.93h,93.25t/data=!3m8!1e1!3m6!1sAF1QipNjv6f1smybA4dP0uRoIyw_GIbnReVkALNVG3I!2e10!3e11!6shttps:%2F%2Flh5.googleusercontent.com%2Fp%2FAF1QipNjv6f1smybA4dP0uRoIyw_GIbnReVkALNVG3I%3Dw203-h100-k-no-pi-0-ya131.89162-ro-0-fo100!7i12000!8i6000?entry=ttu",
        embed: "https://www.google.com/maps/embed?pb=!4v1686332601363!6m8!1m7!1sCAoSK0FGMVFpcE5qdjZmMXNteWJBNGRQMHVSb0l5d19HSWJuUmVWa0FMTlZHM0k.!2m2!1d60.1378835301528!2d24.99053198844194!3f265.93!4f3.25!5f0.7820865974627469"
    }, {
        name: "Georgia",
        link: "https://www.google.com/maps/@41.673687,44.7001648,3a,90y,273.65h,94.23t/data=!3m8!1e1!3m6!1sAF1QipP7zxCvlgC4OSmyogVOtTIcpywfxMb1SEJ_u5AI!2e10!3e11!6shttps:%2F%2Flh5.googleusercontent.com%2Fp%2FAF1QipP7zxCvlgC4OSmyogVOtTIcpywfxMb1SEJ_u5AI%3Dw203-h100-k-no-pi-0-ya181-ro-0-fo100!7i8704!8i4352?entry=ttu",
        embed: "https://www.google.com/maps/embed?pb=!4v1686332608703!6m8!1m7!1sCAoSLEFGMVFpcFA3enhDdmxnQzRPU215b2dWT3RUSWNweXdmeE1iMVNFSl91NUFJ!2m2!1d41.673687!2d44.7001648!3f273.65!4f4.230000000000004!5f0.4000000000000002"
    }, {
        name: "Germany",
        link: "https://www.google.com/maps/@47.737947,7.6892312,3a,75y,226.36h,109.5t/data=!3m8!1e1!3m6!1sAF1QipMPKawADsqR1qnoUutccjsFqV5458Fo6pNZQl0!2e10!3e11!6shttps:%2F%2Flh5.googleusercontent.com%2Fp%2FAF1QipMPKawADsqR1qnoUutccjsFqV5458Fo6pNZQl0%3Dw203-h100-k-no-pi-0-ya324.57867-ro-0-fo100!7i8704!8i4352?entry=ttu",
        embed: "https://www.google.com/maps/embed?pb=!4v1686332611797!6m8!1m7!1sCAoSK0FGMVFpcE1QS2F3QURzcVIxcW5vVXV0Y2Nqc0ZxVjU0NThGbzZwTlpRbDA.!2m2!1d47.737947!2d7.689231200000001!3f226.36!4f19.5!5f0.7820865974627469"
    }, {
        name: "Hungary",
        link: "https://www.google.com/maps/@47.1917777,18.4107785,3a,90y,230.2h,79.11t/data=!3m8!1e1!3m6!1sAF1QipPv-pCjLbZrWV1hu0oP69sTqvgV9pTZqjtV48tj!2e10!3e11!6shttps:%2F%2Flh5.googleusercontent.com%2Fp%2FAF1QipPv-pCjLbZrWV1hu0oP69sTqvgV9pTZqjtV48tj%3Dw203-h100-k-no-pi-0-ya103.78106-ro-0-fo100!7i9000!8i4500?entry=ttu",
        embed: "https://www.google.com/maps/embed?pb=!4v1686332628469!6m8!1m7!1sCAoSLEFGMVFpcFB2LXBDakxiWnJXVjFodTBvUDY5c1RxdmdWOXBUWnFqdFY0OHRq!2m2!1d47.19177768270664!2d18.4107785381816!3f230.2!4f-10.89!5f0.4000000000000002"
    }, {
        name: "Indonesia",
        link: "https://www.google.com/maps/@-3.8433943,122.0486517,3a,90y,290.41h,80.33t/data=!3m6!1e1!3m4!1svvtoiual62rn1U6c2NvRnQ!2e0!7i13312!8i6656?entry=ttu",
        embed: "https://www.google.com/maps/embed?pb=!4v1686332634720!6m8!1m7!1svvtoiual62rn1U6c2NvRnQ!2m2!1d-3.843394332539138!2d122.0486517430776!3f290.41!4f-9.670000000000002!5f0.4000000000000002"
    }, {
        name: "Israel",
        link: "https://www.google.com/maps/@32.056203,34.750012,3a,75y,138.82h,83.17t/data=!3m8!1e1!3m6!1sAF1QipMXWMsEgekhu28ctRhoPtxtV_3dXbRjJ-ADf-r1!2e10!3e11!6shttps:%2F%2Flh5.googleusercontent.com%2Fp%2FAF1QipMXWMsEgekhu28ctRhoPtxtV_3dXbRjJ-ADf-r1%3Dw203-h100-k-no-pi-0-ya20.689228-ro-0-fo100!7i12000!8i6000?entry=ttu",
        embed: "https://www.google.com/maps/embed?pb=!4v1686332638968!6m8!1m7!1sCAoSLEFGMVFpcE1YV01zRWdla2h1MjhjdFJob1B0eHRWXzNkWGJSakotQURmLXIx!2m2!1d32.056203!2d34.750012!3f138.82!4f-6.829999999999998!5f0.7820865974627469"
    }, {
        name: "Kenya",
        link: "https://www.google.com/maps/@-3.9941269,39.6959344,3a,75y,165.56h,89.86t/data=!3m6!1e1!3m4!1s5U9Rh5BRuFrCA5dOBChIJQ!2e0!7i16384!8i8192?entry=ttu",
        embed: "https://www.google.com/maps/embed?pb=!4v1686332651820!6m8!1m7!1s5U9Rh5BRuFrCA5dOBChIJQ!2m2!1d-3.994126918268447!2d39.69593443016079!3f165.56!4f-0.14000000000000057!5f0.7820865974627469"
    }, {
        name: "Liberia",
        link: "https://www.google.com/maps/@6.3172542,-10.8066699,3a,90y,50.26h,96.11t/data=!3m7!1e1!3m5!1sAF1QipOPpDjxiVsIlqxYoQ_CrtotKJkhfbZOfbyJStR9!2e10!3e11!7i7680!8i3840?entry=ttu",
        embed: "https://www.google.com/maps/embed?pb=!4v1686332662148!6m8!1m7!1sCAoSLEFGMVFpcE9QcERqeGlWc0lscXhZb1FfQ3J0b3RLSmtoZmJaT2ZieUpTdFI5!2m2!1d6.317254223164158!2d-10.80666989120235!3f50.26!4f6.109999999999999!5f0.4000000000000002"
    }, {
        name: "Madagascar",
        link: "https://www.google.com/maps/@-18.9234437,47.5319465,2a,75y,72.19h,100.77t/data=!3m7!1e1!3m5!1sYohII4q3A6QYAaDyJI_-KQ!2e0!6shttps:%2F%2Fstreetviewpixels-pa.googleapis.com%2Fv1%2Fthumbnail%3Fpanoid%3DYohII4q3A6QYAaDyJI_-KQ%26cb_client%3Dmaps_sv.tactile.gps%26w%3D203%26h%3D100%26yaw%3D279.88742%26pitch%3D-20.11257%26thumbfov%3D100!7i13312!8i6656?entry=ttu",
        embed: "https://www.google.com/maps/embed?pb=!4v1686332669517!6m8!1m7!1sYohII4q3A6QYAaDyJI_-KQ!2m2!1d-18.92344366752726!2d47.53194652035273!3f72.19!4f10.769999999999996!5f0.7820865974627469"
    }, {
        name: "New Zealand",
        link: "https://www.google.com/maps/@-37.8717785,175.6828837,3a,75y,142h,87.82t/data=!3m6!1e1!3m4!1sZafOzmzIQnx7u7CnD0dMkg!2e0!7i13312!8i6656?entry=ttu",
        embed: "https://www.google.com/maps/embed?pb=!4v1686332696468!6m8!1m7!1sZafOzmzIQnx7u7CnD0dMkg!2m2!1d-37.87177853802388!2d175.682883726137!3f142!4f-2.180000000000007!5f0.7820865974627469"
    }, {
        name: "Norway",
        link: "https://www.google.com/maps/@58.721475,9.235935,3a,75y,184.68h,81.84t/data=!3m6!1e1!3m4!1sflanBzb_7quSGyG9vP9DmA!2e0!7i16384!8i8192?entry=ttu",
        embed: "https://www.google.com/maps/embed?pb=!4v1686332700135!6m8!1m7!1sflanBzb_7quSGyG9vP9DmA!2m2!1d58.72147503485372!2d9.235934985588043!3f184.68!4f-8.159999999999997!5f0.7820865974627469"
    }, {
        name: "Philippines",
        link: "https://www.google.com/maps/@14.6296075,121.0964071,3a,90y,152.33h,94.9t/data=!3m6!1e1!3m4!1shDbmXwkTQv1NYH36K6Vr2A!2e0!7i16384!8i8192?entry=ttu",
        embed: "https://www.google.com/maps/embed?pb=!4v1686332710402!6m8!1m7!1shDbmXwkTQv1NYH36K6Vr2A!2m2!1d14.62960745037837!2d121.0964071307574!3f152.33!4f4.900000000000006!5f0.4000000000000002"
    }, {
        name: "Portugal",
        link: "https://www.google.com/maps/@38.709765,-9.1335375,3a,90y,46.68h,103.28t/data=!3m7!1e1!3m5!1sSZ1ENOyWibCarEvBdMM_lg!2e0!6shttps:%2F%2Fstreetviewpixels-pa.googleapis.com%2Fv1%2Fthumbnail%3Fpanoid%3DSZ1ENOyWibCarEvBdMM_lg%26cb_client%3Dmaps_sv.tactile.gps%26w%3D203%26h%3D100%26yaw%3D66.14479%26pitch%3D0%26thumbfov%3D100!7i16384!8i8192?entry=ttu",
        embed: "https://www.google.com/maps/embed?pb=!4v1686332713772!6m8!1m7!1sSZ1ENOyWibCarEvBdMM_lg!2m2!1d38.70976500817227!2d-9.133537484566608!3f46.68!4f13.280000000000001!5f0.4000000000000002"
    }, {
        name: "Romania",
        link: "https://www.google.com/maps/@44.4268929,26.1029659,3a,90y,242.94h,79.39t/data=!3m7!1e1!3m5!1sV8CqZprZitaQJynaUAjEAw!2e0!6shttps:%2F%2Fstreetviewpixels-pa.googleapis.com%2Fv1%2Fthumbnail%3Fpanoid%3DV8CqZprZitaQJynaUAjEAw%26cb_client%3Dmaps_sv.tactile.gps%26w%3D203%26h%3D100%26yaw%3D232.60112%26pitch%3D0%26thumbfov%3D100!7i16384!8i8192?entry=ttu",
        embed: "https://www.google.com/maps/embed?pb=!4v1686332719970!6m8!1m7!1sV8CqZprZitaQJynaUAjEAw!2m2!1d44.42689291919224!2d26.10296593559447!3f242.94!4f-10.61!5f0.4000000000000002"
    }, {
        name: "Russia",
        link: "https://www.google.com/maps/@55.7317335,37.50607,3a,90y,268.32h,109.04t/data=!3m8!1e1!3m6!1sAF1QipPF0nkb1BphX6nNlCFBbGPGGQpV2e0b0R1qAPAS!2e10!3e11!6shttps:%2F%2Flh5.googleusercontent.com%2Fp%2FAF1QipPF0nkb1BphX6nNlCFBbGPGGQpV2e0b0R1qAPAS%3Dw203-h100-k-no-pi-7.990353-ya159.14302-ro0-fo100!7i6000!8i3000?entry=ttu",
        embed: "https://www.google.com/maps/embed?pb=!4v1686332723639!6m8!1m7!1sCAoSLEFGMVFpcFBGMG5rYjFCcGhYNm5ObENGQmJHUEdHUXBWMmUwYjBSMXFBUEFT!2m2!1d55.73173347549965!2d37.50606995075941!3f268.32!4f19.040000000000006!5f0.4000000000000002"
    }, {
        name: "Slovenia",
        link: "https://www.google.com/maps/@46.5602916,15.6494557,3a,90y,120.87h,108.58t/data=!3m6!1e1!3m4!1ssNFPSsrlsNTIDAcHLasCIw!2e0!7i13312!8i6656?entry=ttu",
        embed: "https://www.google.com/maps/embed?pb=!4v1686332731147!6m8!1m7!1ssNFPSsrlsNTIDAcHLasCIw!2m2!1d46.56029155259352!2d15.64945569779819!3f120.87!4f18.58!5f0.4000000000000002"
    }, {
        name: "Venezuela",
        link: "https://www.google.com/maps/@10.5132439,-66.9125697,3a,90y,172.89h,96.27t/data=!3m6!1e1!3m4!1sAF1QipMbqPPfLC_S0tN8EfzjYT7E1MZx__mHgL_4g4XM!2e10!7i8000!8i4000?entry=ttu",
        embed: "https://www.google.com/maps/embed?pb=!4v1686332761420!6m8!1m7!1sCAoSLEFGMVFpcE1icVBQZkxDX1MwdE44RWZ6allUN0UxTVp4X19tSGdMXzRnNFhN!2m2!1d10.5132439351186!2d-66.9125697389245!3f172.89!4f6.269999999999996!5f0.4000000000000002"
    }, {
        name: "Albania",
        link: "https://www.google.com/maps/@41.7848555,19.6466145,3a,75y,349.04h,83.42t/data=!3m8!1e1!3m6!1sAF1QipNinVjWOad3Rxb7XNBtV-RuosgnwYaI24bVQgn1!2e10!3e11!6shttps:%2F%2Flh5.googleusercontent.com%2Fp%2FAF1QipNinVjWOad3Rxb7XNBtV-RuosgnwYaI24bVQgn1%3Dw203-h100-k-no-pi-0-ya291.11536-ro0-fo100!7i12000!8i6000?entry=ttu",
        embed: "https://www.google.com/maps/embed?pb=!4v1687119136328!6m8!1m7!1sCAoSLEFGMVFpcE5pblZqV09hZDNSeGI3WE5CdFYtUnVvc2dud1lhSTI0YlZRZ24x!2m2!1d41.784855531691!2d19.646614490124!3f349.04!4f-6.579999999999998!5f0.7820865974627469"
    }, {
        name: "Belgium",
        link: "https://www.google.com/maps/@51.2089881,2.8846616,3a,75y,77.68h,86.15t/data=!3m7!1e1!3m5!1sjT026m8Nhnp7aQIXqudXeQ!2e0!6shttps:%2F%2Fstreetviewpixels-pa.googleapis.com%2Fv1%2Fthumbnail%3Fpanoid%3DjT026m8Nhnp7aQIXqudXeQ%26cb_client%3Dmaps_sv.tactile.gps%26w%3D203%26h%3D100%26yaw%3D335.1454%26pitch%3D0%26thumbfov%3D100!7i13312!8i6656?entry=ttu",
        embed: "https://www.google.com/maps/embed?pb=!4v1687119150490!6m8!1m7!1sjT026m8Nhnp7aQIXqudXeQ!2m2!1d51.20898806548806!2d2.884661580230813!3f77.68!4f-3.8499999999999943!5f0.7820865974627469"
    }, {
        name: "Botswana",
        link: "https://www.google.com/maps/@-20.5000325,25.1290002,3a,75y,252.33h,85.04t/data=!3m8!1e1!3m6!1sAF1QipMDuc5f1dsCAzL9Cq4ESTWWjJCRmiztQydJ4_cq!2e10!3e11!6shttps:%2F%2Flh5.googleusercontent.com%2Fp%2FAF1QipMDuc5f1dsCAzL9Cq4ESTWWjJCRmiztQydJ4_cq%3Dw203-h100-k-no-pi-0.37066647-ya234.55408-ro-0.0015957364-fo100!7i8192!8i4096?entry=ttu",
        embed: "https://www.google.com/maps/embed?pb=!4v1687119154762!6m8!1m7!1sCAoSLEFGMVFpcE1EdWM1ZjFkc0NBekw5Q3E0RVNUV1dqSkNSbWl6dFF5ZEo0X2Nx!2m2!1d-20.5000325!2d25.1290002!3f252.33!4f-4.959999999999994!5f0.7820865974627469"
    }, {
        name: "Colombia",
        link: "https://www.google.com/maps/@3.8597977,-76.5402389,3a,89.6y,268.63h,93.31t/data=!3m7!1e1!3m5!1s0owHJBDb2iocP6zfIwfe4w!2e0!6shttps:%2F%2Fstreetviewpixels-pa.googleapis.com%2Fv1%2Fthumbnail%3Fpanoid%3D0owHJBDb2iocP6zfIwfe4w%26cb_client%3Dmaps_sv.tactile.gps%26w%3D203%26h%3D100%26yaw%3D321.72473%26pitch%3D0%26thumbfov%3D100!7i16384!8i8192?entry=ttu",
        embed: "https://www.google.com/maps/embed?pb=!4v1687119182731!6m8!1m7!1s0owHJBDb2iocP6zfIwfe4w!2m2!1d3.859797749837747!2d-76.5402388588541!3f268.63!4f3.3100000000000023!5f0.41007199324273763"
    }, {
        name: "Croatia",
        link: "https://www.google.com/maps/@45.0818662,13.6344663,3a,75y,28.73h,90.79t/data=!3m8!1e1!3m6!1sAF1QipNxu5Kc6xxdunr1xW0Sq-mKCDb927to-swDSb4q!2e10!3e11!6shttps:%2F%2Flh5.googleusercontent.com%2Fp%2FAF1QipNxu5Kc6xxdunr1xW0Sq-mKCDb927to-swDSb4q%3Dw203-h100-k-no-pi1.7888254-ya287.53204-ro-0.705416-fo100!7i7680!8i3840?entry=ttu",
        embed: "https://www.google.com/maps/embed?pb=!4v1687119196042!6m8!1m7!1sCAoSLEFGMVFpcE54dTVLYzZ4eGR1bnIxeFcwU3EtbUtDRGI5Mjd0by1zd0RTYjRx!2m2!1d45.08186619968883!2d13.63446634306079!3f28.73!4f0.7900000000000063!5f0.7820865974627469"
    }, {
        name: "Germany",
        link: "https://www.google.com/maps/@47.9951764,7.8529328,3a,74.5y,326.02h,114.9t/data=!3m8!1e1!3m6!1sAF1QipM7l-6U8Z7w57_nCeqbllh1hShZ1Tb7KatMH1OH!2e10!3e11!6shttps:%2F%2Flh5.googleusercontent.com%2Fp%2FAF1QipM7l-6U8Z7w57_nCeqbllh1hShZ1Tb7KatMH1OH%3Dw203-h100-k-no-pi-17.10611-ya346.90536-ro-0-fo100!7i13312!8i6656?entry=ttu",
        embed: "https://www.google.com/maps/embed?pb=!4v1687119232778!6m8!1m7!1sCAoSLEFGMVFpcE03bC02VThaN3c1N19uQ2VxYmxsaDFoU2haMVRiN0thdE1IMU9I!2m2!1d47.99517639017938!2d7.852932849698391!3f326.02!4f24.900000000000006!5f0.7951360383703611"
    }, {
        name: "Ghana",
        link: "https://www.google.com/maps/@6.6957825,-1.6165838,3a,90y,257.8h,81.84t/data=!3m7!1e1!3m5!1ss2jaeN-KjhsrQLbcMiGrpQ!2e0!6shttps:%2F%2Fstreetviewpixels-pa.googleapis.com%2Fv1%2Fthumbnail%3Fpanoid%3Ds2jaeN-KjhsrQLbcMiGrpQ%26cb_client%3Dmaps_sv.tactile.gps%26w%3D203%26h%3D100%26yaw%3D326.98788%26pitch%3D0%26thumbfov%3D100!7i13312!8i6656?entry=ttu",
        embed: "https://www.google.com/maps/embed?pb=!4v1687119235842!6m8!1m7!1ss2jaeN-KjhsrQLbcMiGrpQ!2m2!1d6.695782542655994!2d-1.616583768625464!3f257.8!4f-8.159999999999997!5f0.4000000000000002"
    }, {
        name: "India",
        link: "https://www.google.com/maps/@26.923828,75.8270749,3a,75y,285.54h,105.75t/data=!3m6!1e1!3m4!1s1Axyv3l_iqt9yWzC4gIdqg!2e0!7i13312!8i6656?entry=ttu",
        embed: "https://www.google.com/maps/embed?pb=!4v1687119247070!6m8!1m7!1s1Axyv3l_iqt9yWzC4gIdqg!2m2!1d26.9238280486489!2d75.82707492149625!3f285.54!4f15.75!5f0.7820865974627469"
    }, {
        name: "Indonesia",
        link: "https://www.google.com/maps/@-3.0825232,119.9169088,3a,75y,228.56h,98.57t/data=!3m6!1e1!3m4!1s26jryH9JuOBs4IO9Y1QmOw!2e0!7i16384!8i8192?entry=ttu",
        embed: "https://www.google.com/maps/embed?pb=!4v1687119250014!6m8!1m7!1s26jryH9JuOBs4IO9Y1QmOw!2m2!1d-3.082523173064316!2d119.9169088254661!3f228.56!4f8.569999999999993!5f0.7820865974627469"
    }, {
        name: "Iran",
        link: "https://www.google.com/maps/@30.4325525,56.057296,3a,75y,151.04h,95.09t/data=!3m8!1e1!3m6!1sAF1QipO3JLTtHCK62IXs7Ja_EfxD9wlU_Ge8jPPKMCZW!2e10!3e11!6shttps:%2F%2Flh5.googleusercontent.com%2Fp%2FAF1QipO3JLTtHCK62IXs7Ja_EfxD9wlU_Ge8jPPKMCZW%3Dw203-h100-k-no-pi-10-ya189.07047-ro-0-fo100!7i5940!8i2970?entry=ttu",
        embed: "https://www.google.com/maps/embed?pb=!4v1687119253733!6m8!1m7!1sCAoSLEFGMVFpcE8zSkxUdEhDSzYySVhzN0phX0VmeEQ5d2xVX0dlOGpQUEtNQ1pX!2m2!1d30.43255247853044!2d56.05729599476224!3f151.04!4f5.090000000000003!5f0.7820865974627469"
    }, {
        name: "Italy",
        link: "https://www.google.com/maps/@41.8982242,12.4731588,3a,90y,175.69h,83.45t/data=!3m8!1e1!3m6!1sAF1QipPaNur2R3fJWzM5XCDlEPK7i9CQ7asIMgjjJO6L!2e10!3e11!6shttps:%2F%2Flh5.googleusercontent.com%2Fp%2FAF1QipPaNur2R3fJWzM5XCDlEPK7i9CQ7asIMgjjJO6L%3Dw203-h100-k-no-pi-0-ya248.70602-ro-0-fo100!7i6528!8i3264?entry=ttu",
        embed: "https://www.google.com/maps/embed?pb=!4v1687119265815!6m8!1m7!1sCAoSLEFGMVFpcFBhTnVyMlIzZkpXek01WENEbEVQSzdpOUNRN2FzSU1nampKTzZM!2m2!1d41.898224225052!2d12.47315876255!3f175.69!4f-6.549999999999997!5f0.4000000000000002"
    }, {
        name: "Japan",
        link: "https://www.google.com/maps/@36.7326326,138.4621769,2a,75y,132.59h,75.21t/data=!3m7!1e1!3m5!1s-_0l0tU3lKz0JtaEsqJk7w!2e0!6shttps:%2F%2Fstreetviewpixels-pa.googleapis.com%2Fv1%2Fthumbnail%3Fpanoid%3D-_0l0tU3lKz0JtaEsqJk7w%26cb_client%3Dmaps_sv.tactile.gps%26w%3D203%26h%3D100%26yaw%3D294.00262%26pitch%3D0%26thumbfov%3D100!7i13312!8i6656?entry=ttu",
        embed: "https://www.google.com/maps/embed?pb=!4v1687119273227!6m8!1m7!1s-_0l0tU3lKz0JtaEsqJk7w!2m2!1d36.732632613848!2d138.4621769294279!3f132.59!4f-14.790000000000006!5f0.7820865974627469"
    }, {
        name: "Jordan",
        link: "https://www.google.com/maps/@31.9516112,35.9393884,2a,75y,308.12h,83.76t/data=!3m7!1e1!3m5!1siUBbBTb3yDoFEFhUe4GnCg!2e0!6shttps:%2F%2Fstreetviewpixels-pa.googleapis.com%2Fv1%2Fthumbnail%3Fpanoid%3DiUBbBTb3yDoFEFhUe4GnCg%26cb_client%3Dmaps_sv.tactile.gps%26w%3D203%26h%3D100%26yaw%3D126.0864%26pitch%3D0%26thumbfov%3D100!7i13312!8i6656?entry=ttu",
        embed: "https://www.google.com/maps/embed?pb=!4v1687119276293!6m8!1m7!1siUBbBTb3yDoFEFhUe4GnCg!2m2!1d31.95161115368211!2d35.93938839552868!3f308.12!4f-6.239999999999995!5f0.7820865974627469"
    }, {
        name: "Kenya",
        link: "https://www.google.com/maps/@-1.2839794,36.8208278,3a,90y,336.57h,88.24t/data=!3m6!1e1!3m4!1sGwPdUdRZdv9AXcFndU_EOQ!2e0!7i16384!8i8192?entry=ttu",
        embed: "https://www.google.com/maps/embed?pb=!4v1687119279399!6m8!1m7!1sGwPdUdRZdv9AXcFndU_EOQ!2m2!1d-1.283979405927672!2d36.82082780827069!3f336.57!4f-1.7600000000000051!5f0.4000000000000002"
    }, {
        name: "Latvia",
        link: "https://www.google.com/maps/@56.9474378,24.1063499,3a,90y,91.94h,96.81t/data=!3m6!1e1!3m4!1s-36m3Um4REUCCCjuzfjYaA!2e0!7i13312!8i6656?entry=ttu",
        embed: "https://www.google.com/maps/embed?pb=!4v1687119286097!6m8!1m7!1s-36m3Um4REUCCCjuzfjYaA!2m2!1d56.9474378136615!2d24.10634993779821!3f91.94!4f6.810000000000002!5f0.4000000000000002"
    }, {
        name: "Lithuania",
        link: "https://www.google.com/maps/@55.798336,21.0670862,3a,75y,334.07h,87.38t/data=!3m8!1e1!3m6!1sAF1QipNSDdBQRgxfsZ-7vVIbXh7OvjiZldscjXjuxsII!2e10!3e11!6shttps:%2F%2Flh5.googleusercontent.com%2Fp%2FAF1QipNSDdBQRgxfsZ-7vVIbXh7OvjiZldscjXjuxsII%3Dw203-h100-k-no-pi-0-ya9.096276-ro-0-fo100!7i9204!8i4602?entry=ttu",
        embed: "https://www.google.com/maps/embed?pb=!4v1687119299805!6m8!1m7!1sCAoSLEFGMVFpcE5TRGRCUVJneGZzWi03dlZJYlhoN092amlabGRzY2pYanV4c0lJ!2m2!1d55.79833599951167!2d21.06708616018295!3f334.07!4f-2.6200000000000045!5f0.7820865974627469"
    }, {
        name: "Malaysia",
        link: "https://www.google.com/maps/@3.2375917,101.684043,3a,90y,7.13h,116.58t/data=!3m8!1e1!3m6!1sAF1QipNCtfgdaFJRxi3C4YPLoBPdwp3ba8gYPG_UHoHd!2e10!3e11!6shttps:%2F%2Flh5.googleusercontent.com%2Fp%2FAF1QipNCtfgdaFJRxi3C4YPLoBPdwp3ba8gYPG_UHoHd%3Dw203-h100-k-no-pi-0-ya290.8275-ro0-fo100!7i8704!8i4352?entry=ttu",
        embed: "https://www.google.com/maps/embed?pb=!4v1687119309719!6m8!1m7!1sCAoSLEFGMVFpcE5DdGZnZGFGSlJ4aTNDNFlQTG9CUGR3cDNiYThnWVBHX1VIb0hk!2m2!1d3.2375917!2d101.684043!3f7.13!4f26.58!5f0.4000000000000002"
    }, {
        name: "Netherlands",
        link: "https://www.google.com/maps/@52.113111,4.2802872,3a,90y,199.78h,96.26t/data=!3m6!1e1!3m4!1sj1uAVlzaTU4GQyduJYzjuA!2e0!7i16384!8i8192?entry=ttu",
        embed: "https://www.google.com/maps/embed?pb=!4v1687119343452!6m8!1m7!1sj1uAVlzaTU4GQyduJYzjuA!2m2!1d52.11311104606541!2d4.28028724851124!3f199.78!4f6.260000000000005!5f0.4000000000000002"
    }, {
        name: "New Zealand",
        link: "https://www.google.com/maps/@-39.5010522,176.9184996,3a,90y,68.64h,88.81t/data=!3m6!1e1!3m4!1sJCSiYBxjbDe_EPTZw_7gDQ!2e0!7i16384!8i8192?entry=ttu",
        embed: "https://www.google.com/maps/embed?pb=!4v1687119346564!6m8!1m7!1sJCSiYBxjbDe_EPTZw_7gDQ!2m2!1d-39.5010521533879!2d176.918499552169!3f68.64!4f-1.1899999999999977!5f0.4000000000000002"
    }, {
        name: "Nigeria",
        link: "https://www.google.com/maps/@9.0809615,7.5243988,2a,90y,84.34h,85.05t/data=!3m6!1e1!3m4!1sINHBz4HdSwMAAAQrBnftjg!2e0!7i13312!8i6656?entry=ttu",
        embed: "https://www.google.com/maps/embed?pb=!4v1687119352692!6m8!1m7!1sINHBz4HdSwMAAAQrBnftjg!2m2!1d9.080961517214682!2d7.524398838108427!3f84.34!4f-4.950000000000003!5f0.4000000000000002"
    }, {
        name: "Poland",
        link: "https://www.google.com/maps/@52.2494052,20.9923145,3a,90y,99.76h,104.25t/data=!3m6!1e1!3m4!1seXEScTe7gqoljTOV4M_1PA!2e0!7i16384!8i8192?entry=ttu",
        embed: "https://www.google.com/maps/embed?pb=!4v1687119378940!6m8!1m7!1seXEScTe7gqoljTOV4M_1PA!2m2!1d52.24940517758763!2d20.99231454742342!3f99.76!4f14.25!5f0.4000000000000002"
    }, {
        name: "Singapore",
        link: "https://www.google.com/maps/@1.2806527,103.8642833,2a,90y,41.99h,89.35t/data=!3m7!1e1!3m5!1sb7tYegC8sOpQiSgx9CjtNA!2e0!6shttps:%2F%2Fstreetviewpixels-pa.googleapis.com%2Fv1%2Fthumbnail%3Fpanoid%3Db7tYegC8sOpQiSgx9CjtNA%26cb_client%3Dmaps_sv.tactile.gps%26w%3D203%26h%3D100%26yaw%3D84.62819%26pitch%3D0%26thumbfov%3D100!7i13312!8i6656?entry=ttu",
        embed: "https://www.google.com/maps/embed?pb=!4v1687119382058!6m8!1m7!1sb7tYegC8sOpQiSgx9CjtNA!2m2!1d1.280652667541553!2d103.8642833171509!3f41.99!4f-0.6500000000000057!5f0.4000000000000002"
    }, {
        name: "Spain",
        link: "https://www.google.com/maps/@37.1760783,-3.5881413,3a,90y,12.6h,91.86t/data=!3m8!1e1!3m6!1sAF1QipP9qAD3ssenWODwqFLIT6VbwAD4FzlXgKbgmht7!2e10!3e11!6shttps:%2F%2Flh5.googleusercontent.com%2Fp%2FAF1QipP9qAD3ssenWODwqFLIT6VbwAD4FzlXgKbgmht7%3Dw203-h100-k-no-pi-0-ya139.54929-ro0-fo100!7i6144!8i3072?entry=ttu",
        embed: "https://www.google.com/maps/embed?pb=!4v1687119386122!6m8!1m7!1sCAoSLEFGMVFpcFA5cUFEM3NzZW5XT0R3cUZMSVQ2VmJ3QUQ0RnpsWGdLYmdtaHQ3!2m2!1d37.1760783!2d-3.5881413!3f12.6!4f1.8599999999999994!5f0.4000000000000002"
    }, {
        name: "Sweden",
        link: "https://www.google.com/maps/@65.8055012,21.678883,3a,90y,202.99h,90.85t/data=!3m7!1e1!3m5!1sO7gt2w-yxeZI97e82gkunQ!2e0!6shttps:%2F%2Fstreetviewpixels-pa.googleapis.com%2Fv1%2Fthumbnail%3Fpanoid%3DO7gt2w-yxeZI97e82gkunQ%26cb_client%3Dmaps_sv.tactile.gps%26w%3D203%26h%3D100%26yaw%3D194.25218%26pitch%3D0%26thumbfov%3D100!7i16384!8i8192?entry=ttu",
        embed: "https://www.google.com/maps/embed?pb=!4v1687119389195!6m8!1m7!1sO7gt2w-yxeZI97e82gkunQ!2m2!1d65.80550118091678!2d21.67888296764118!3f202.99!4f0.8499999999999943!5f0.4000000000000002"
    }]

    const updateCountry = async () => {
        countryLabel.textContent = countries[currentCountryIndex].name;
        countryEmbed.setAttribute('src', countries[currentCountryIndex].embed);
    }

    document.getElementById('copy-country').onclick = async () => {
        navigator.clipboard.writeText(countryLabel.textContent);
    }

    document.getElementById('previous-country').onclick = async () => {
        if (currentCountryIndex !== 0) {
            currentCountryIndex--;
            updateCountry();
        }
    }

    document.getElementById('next-country').onclick = async () => {
        if (currentCountryIndex !== countries.length) {
            currentCountryIndex++;
            updateCountry();
        }
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
        case 'geoguessr':
            removeWithId('geoguessr');
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
        case 'geoguessr':
            createGeoguessr();
            break;
    }
    
    oldValue = e.target.value;
};