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

        if (dataArray.length > 0) {
        outputLabel.textContent = 'Video data found!';
        } else {
        outputLabel.textContent = 'No video data found for the provided time.';
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
    `;

    document.body.appendChild(puzzleSolverDiv);

    // AHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH
    
    const puzzleSolutionLabel = document.getElementById('puzzle-solution');

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

        <textarea id="input" class="input"></textarea>

        <button id="validate">Validate</button>

        <ul id="result" class="rules-list"></ul>
    `;

    document.body.appendChild(inputSolverDiv);

    const inputTextArea = document.getElementById('input');
    const resultList = document.getElementById('result');

    document.getElementById('validate').onclick = async () => {
        const [passedRule5, total, passedRule9, roman_numerals, passedRule18, atomicTotal] = await validateInput(inputTextArea.value);
        resultList.innerHTML = "";
        
        createRuleItem(5, `The digits in your password must add up to 25. (${total})`, passedRule5);
        createRuleItem(9, `The Roman numerals in your password should multiply to 35. (${roman_numerals})`, passedRule9);
        createRuleItem(18, `The elements in your password must have atomic numbers that add up to 200. (${atomicTotal})`, passedRule18);
    }

    const createRuleItem = async (ruleNumber, ruleDescription, passed) => {
        const li = document.createElement('li');
        li.className = passed ? 'passed-rule' : 'failed-rule';
        resultList.appendChild(li);

        const ruleTitleSpan = document.createElement('span'); 
        ruleTitleSpan.textContent = "Rule " + ruleNumber;
        li.appendChild(ruleTitleSpan);

        const ruleDescriptionDiv = document.createElement('div');
        ruleDescriptionDiv.textContent = ruleDescription;
        li.appendChild(ruleDescriptionDiv);
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
  
        let atomicTotal = 0;
        let romanNumeralValues = [];
        let lastRoman = false;
        let nextChar = null;
        let total = 0;
  
        for (let i = 0; i < input.length; i++) {
          const c = input[i];
          const romanValue = romanNumerals.get(c);
  
          if (romanValue !== undefined) {
            if (lastRoman) {
              const lastRomanChar = romanNumeralValues[romanNumeralValues.length - 1][0].charAt(romanNumeralValues[romanNumeralValues.length - 1][0].length - 1);
              const lastRomanValue = romanNumerals.get(lastRomanChar);
              if (lastRomanValue < romanValue) {
                romanNumeralValues.push([c, romanValue]);
              } else {
                romanNumeralValues[romanNumeralValues.length - 1][0] += c;
                romanNumeralValues[romanNumeralValues.length - 1][1] += romanValue;
              }
            } else {
              romanNumeralValues.push([c, romanValue]);
            }
            lastRoman = true;
          } else {
            lastRoman = false;
          }
  
          const digit = parseInt(c, 10);
          if (!isNaN(digit)) {
            total += digit;
          }
  
          nextChar = i < input.length - 1 ? input[i + 1] : null;
          let element = c;
  
          if (nextChar !== null) {
            element += nextChar;
            const atomicNumber = periodicElements.get(element);
            if (atomicNumber !== undefined) {
              atomicTotal += atomicNumber;
              element = '';
            }
          }
  
          const atomicNumber = periodicElements.get(element);
          if (atomicNumber !== undefined) {
            atomicTotal += atomicNumber;
          }
        }
  
        let romanNumeralsTotal = 0;
        if (romanNumeralValues.length > 0) {
            romanNumeralsTotal = 1;
            for (let i = 0; i < romanNumeralValues.length; i++) {
            romanNumeralsTotal *= romanNumeralValues[i][1];
            }
        }

        return [total == 25, total, romanNumeralsTotal == 35, romanNumeralsTotal, atomicTotal == 200, atomicTotal];
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