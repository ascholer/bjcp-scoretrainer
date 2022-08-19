function stringComp(a, b) {
  return a.toLowerCase().localeCompare(b.toLowerCase());
}

let keywords = {
  'level': {
    title: 'Level',
    list: ['no', 'trace', 'low', 'med', 'medium-high', 'high']
  }, 
  'malt': {
    title: 'Malt',
    list: ['bread', 'bread crust', 'soda cracker', 'toast', 'biscuit', 'graham cracker',
    'honey', 'caramel', 'toffee', 'dark fruit', 'burnt sugar', 'chocolate',
    'cocoa', 'earthy', 'smoke', 'rye', 'grainy', 'hay like']
  },
  'hop': {
    title: 'Hops',
    list: ['piney', 'mint', 'herbal', 'floral', 'pear', 'white wine',
    'earthy', 'black berry', 'berry', 'melon', 'pineapple', 'tropical fruit',
    'grapefruit', 'orange', 'citrus', 'lime', 'lemon', 'lemon grass',
    'resinous', 'spicy', 'woody', 'minty', 'oniony', 'vegetal', 'coconut',
    'catty', 'grassy']
  },
  'yeast': {
    title: 'Yeast',
    list: ['fruity', 'pear', 'bubblegum', 'banana', 'clove', 'peppery', 'sour', 'barnyard',
    'clean sour', 'funky']
  },
  'other': {
    title: 'Other',
    list: ['metalic', 'vinegar', 'green apple', 'alcohol', 'buttery', 'DMS',
    'musty', 'oxidized', 'cardboard', 'skunky', 'plastic', 'band-aid',
    'medicinal', 'solventy', 'mousy', 'rancid', 'cheesy',
    'yeasty', 'sulfur', 'cidery', 'sulphur', 'salty', 'sour']
  },
  'color': {
    title: 'Color',
    list: ['pale yellow', 'yellow', 'gold', 'amber', 'red', 'copper', 'brown', 'black']
  },
  'clarity': {
    title: 'Clarity',
    list: ['brilliant', 'lightly hazy' ,'hazy', 'cloudy', 'opaque']
  },
  'head': {
    title: 'Head',
    list: ['quick fading', 'persistent', 'lasting']
  },
  'headColor': {
    title: 'HeadColor',
    list: ['white', 'ivory', 'beige', 'tan']
  },
  'otherAppear': {
    title: 'Other',
    list: ['legs', 'lacing', 'particulate']
  },
  'balance': {
    title: 'Balance',
    list: ['heavily towards malt', 'lightly towards malt', 'even', 
    'lightly towards hop', 'heavily towards hop', 
    'lightly towards yeast character', 'heavy towards yeast character']
  },
  'finish': {
    title: 'Finish',
    list: ['dry', 'bitter', 'sweet', 'malty', 'crisp', 'tart', 'sour']
  },
  'body': {
    title: 'Body',
    list: ['thin', 'medium', 'full', 'body']
  }
};

let listsToSort = ['malt', 'hop', 'yeast', 'other', 'head', 'otherAppear']
for(let name of listsToSort) {
  keywords[name].list = keywords[name].list.sort(stringComp);
}



//Inserts text into text area that is related to current dropdown
function insertText(el, value) {
  let target = el.closest(".descript-group").getElementsByTagName('textarea')[0];
  target.focus();
  let upTo = target.value.substr(0, target.selectionStart);
  let after = target.value.substr(target.selectionEnd);
  target.value = upTo + value + (target.value[target.selectionEnd - 1] == ' ' ? ' ' : "") + after;
  target.selectionStart = upTo.length + value.length;
  target.selectionEnd = upTo.length + value.length;
}

//Checks to see if clicked area corresponds to a keyword - is so select it
function textAreaClick(e) {
  let el = e.target;
  let startIndex = el.selectionStart;
  while(startIndex >= 1 && el.value[startIndex - 1].trim() != '' && el.value[startIndex] != '[')
    startIndex--;
  let endIndex = el.selectionStart;
  while(endIndex < el.value.length && el.value[endIndex].trim() != '' && el.value[startIndex - 1] != ']')
    endIndex++;
  let selectWord = el.value.slice(startIndex, endIndex).trim();
  selectWord = selectWord.slice(1, selectWord.length - 1);
  if( Object.keys(keywords).includes(selectWord) ) {
    el.selectionStart = startIndex;
    el.selectionEnd = endIndex;
  }
}

//If keyword
function checkSelect(e) {
  let el = e.target;
  if(el !== document.activeElement)
    return;

  let selectWord = el.value.slice(el.selectionStart + 1, el.selectionEnd - 1).trim();
  if( Object.keys(keywords).includes(selectWord) ) {
    console.log(selectWord);
    let target = el.closest(".descript-group").querySelector('.dropdown-toggle.' + selectWord);
    if(target)
      target.click();
  }
}

var template = `
    <a class="nav-link dropdown-toggle <%=className%>" data-bs-toggle="dropdown" href="#" role="button" aria-expanded="false"><%=title%></a>
    <ul class="dropdown-menu">
      <% for(i = 0; i < list.length; i++) { %>
        <li><a class="dropdown-item" onclick="insertText(this, '<%=list[i]%>');"><%=list[i]%></a></li>
      <% } %>
    </ul>
  `;


function buildDescriptorDropDown(itemName, itemValue) {
  let html = ejs.render(template, { list: itemValue.list, className: itemName, title: itemValue.title });
  let li = document.createElement("li");
  li.className = "nav-item dropdown";
  li.innerHTML = html;
  return li;
}

function initTextAreas() {
  let areas = ['aromaDescript', 'appearanceDescript', 'flavorDescript', 'mouthDescript'];
  for(let area of areas) {
    //Get text area and related nav ul
    let node = document.getElementById(area);
    node.addEventListener('select', checkSelect);
    node.addEventListener('click', textAreaClick);
    let navArea = node.closest(".descript-group").querySelector('ul.nav');
    //Figure out what menus to add
    for(let item in keywords) {
      if(node.value.indexOf(item) != -1)
        navArea.appendChild(buildDescriptorDropDown(item, keywords[item]));
    }
  }
}


function initScores() {
  let scores = document.querySelectorAll('input[type="number"]:not([id="totalScore"])');
  let totalScoreEl = document.getElementById('totalScore');

  //Turn score number inputs into select drop downs
  for (var i = 0; i < scores.length; i++) {
    let newElementHTML = `<select class="form-select" id="${scores[i].id}">`;
    for(let j = 1; j <= parseInt(scores[i].getAttribute('max')); j++)
      newElementHTML += `<option>${j}</option>`;
    newElementHTML += '</select>';
    let newElement = document.createElement('div');
    newElement.innerHTML = newElementHTML;
    scores[i].replaceWith(newElement);
  }
  
  scores = document.querySelectorAll('select');
  for (var i = 0; i < scores.length; i++) {
    scores[i].addEventListener('change', (e) => {
      let total = 0;
      for (var j = 0; j < scores.length; j++) {
        let score = 0;
        if(scores[j].value.trim() !== '')
          score = parseInt(scores[j].value);
        total += score;
      }
      totalScoreEl.value = total;
    });
  }
}

initTextAreas();
initScores();