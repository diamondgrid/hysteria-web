elementNum = 1;
copiedLyricElement = {
    type: 'Verse',
    content: ''
};

const editorContextMenu = document.getElementById('editorContextMenu');
const scope = document.getElementById('editorContent');
const rhymeSearch = document.getElementById('rhymeSearch');

rhymeSearch.addEventListener('keyup', (ev) => {
    if(ev.key === 'Enter') {
        getRhymes();
    }
})

scope.addEventListener('contextmenu', (ev) => {
    ev.preventDefault();

    const { clientX: mouseX, clientY: mouseY } = ev;

    editorContextMenu.style.top = `${mouseY}px`;
    editorContextMenu.style.left = `${mouseX}px`;

    editorContextMenu.classList.add('visible');
});

scope.addEventListener('click', (ev) => {
    editorContextMenu.classList.remove('visible');
})

function changeCardTitle(cardId, newCardTitle) {
    const card = document.getElementById(cardId);
    if(card && newCardTitle) card.innerHTML = newCardTitle + ' <i class="material-icons">arrow_drop_down</i>';
}

function addLyricElement(type, content) {
    elementNum += 1;

    if(!content) content = '';

    const lyricElementHTML = `<div class="white-text card-content"><span class=card-title><a href=# class="white-text dropdown-trigger"data-target=card${elementNum}dropdown id=card${elementNum}title>${type} <i class="material-icons">arrow_drop_down</i></a></span><div class=input-field><textarea class=materialize-textarea placeholder="Write your lyrics here..." id="card${elementNum}textarea">${content}</textarea></div></div><div class=card-action><a href="#" onclick="deleteLyricElement('card${elementNum}');">Delete</a> <a href="#" onclick="copyLyricElement('card${elementNum}title', 'card${elementNum}textarea');">Copy</a></div><ul class="indigo darken-2 dropdown-content" id="card${elementNum}dropdown"><li><a href=# class=white-text onclick='changeCardTitle("card${elementNum}title","Intro")'>Intro</a><li><a href=# class=white-text onclick='changeCardTitle("card${elementNum}title","Verse")'>Verse</a><li><a href=# class=white-text onclick='changeCardTitle("card${elementNum}title","Chorus")'>Chorus</a><li><a href=# class=white-text onclick='changeCardTitle("card${elementNum}title","Bridge")'>Bridge</a><li><a href=# class=white-text onclick='changeCardTitle("card${elementNum}title","Hook")'>Hook</a><li><a href=# class=white-text onclick='changeCardTitle("card${elementNum}title","Outro")'>Outro</a></ul>`;

    const lyricElementDiv = document.createElement('div');
    lyricElementDiv.classList.add('card', 'indigo', 'darken-3', 'lyric-card');
    lyricElementDiv.id = `card${elementNum}`;
    lyricElementDiv.innerHTML = lyricElementHTML;

    const dropdownTrigger = document.getElementById('addNewDropdownTriggerParent');

    dropdownTrigger.parentNode.insertBefore(lyricElementDiv, dropdownTrigger);

    M.AutoInit();
}

function addInstrumentalElement() {
    elementNum += 1;

    const instrumentalElementHTML = `<div class="white-text card-content"><span class=card-title><a href=# class=white-text id=card${elementNum}title>Instrumental <i class=material-icons>music_note</i></a></span><p>This won't show up in Genius format, but it will show up in Musixmatch and JSON.</div><div class=card-action><a href=# onclick='deleteLyricElement("card${elementNum}")'>Delete</a></div>`;

    const instrumentalElementDiv = document.createElement('div');
    instrumentalElementDiv.classList.add('card', 'indigo', 'darken-3', 'lyric-card');
    instrumentalElementDiv.id = `card${elementNum}`;
    instrumentalElementDiv.innerHTML = instrumentalElementHTML;

    const dropdownTrigger = document.getElementById('addNewDropdownTriggerParent');

    dropdownTrigger.parentNode.insertBefore(instrumentalElementDiv, dropdownTrigger);

    M.AutoInit();
}

function deleteLyricElement(lyricElementId) {
    document.getElementById(lyricElementId).remove();
}

function copyLyricElement(elementTitle, elementContent) {
    copiedLyricElement.type = document.getElementById(elementTitle).innerHTML.split(' ')[0];
    copiedLyricElement.content = document.getElementById(elementContent).value;
    M.toast({html: 'Lyric element copied!', classes: 'green'});
}

function pasteLyricElement() {
    addLyricElement(copiedLyricElement.type, copiedLyricElement.content);
}

function exportToHysteria() {

    const editor = document.getElementById('editorContent');
    const lyricElements = document.getElementsByClassName('card');

    const hysteriaContent = '';

}

function exportToGenius() {

    var lyricElements = document.getElementsByClassName('lyric-card');
    lyricElements = Array.prototype.slice.call(lyricElements);

    var geniusContent = '';

    for(lyricElem in lyricElements) {
        if(lyricElements[lyricElem].nodeName !== 'DIV') return;

        if(lyricElements[lyricElem].childNodes[1].nodeName == 'DIV' && lyricElements[lyricElem].childNodes[1].className == 'card-content white-text') {
            var lyricType = lyricElements[lyricElem].childNodes[1].childNodes[1].childNodes[0].innerHTML.split(' ')[0];
            if(lyricType !== 'Instrumental') geniusContent += `[${lyricType}]\n`;
        } else {
            var lyricType = lyricElements[lyricElem].childNodes[0].childNodes[0].childNodes[0].innerHTML.split(' ')[0];
            if(lyricType !== 'Instrumental') geniusContent += `[${lyricType}]\n`;
        }

        if(lyricElements[lyricElem].childNodes[1].nodeName == 'DIV' && lyricElements[lyricElem].childNodes[1].className == 'card-content white-text') {
            var lyricContent = lyricElements[lyricElem].childNodes[1].childNodes[3].childNodes[1].value;
            if(lyricType !== 'Instrumental') geniusContent += `${lyricContent}\n\n`;
        } else {
            var lyricContent = lyricElements[lyricElem].childNodes[0].childNodes[1].childNodes[0].value;
            if(lyricType !== 'Instrumental') geniusContent += `${lyricContent}\n\n`;
        }
    }

    download('genius.txt', geniusContent);

}

function exportToMusixmatch() {

    var lyricElements = document.getElementsByClassName('lyric-card');
    lyricElements = Array.prototype.slice.call(lyricElements);

    var musixContent = '';

    for(lyricElem in lyricElements) {
        if(lyricElements[lyricElem].nodeName !== 'DIV') return;

        if(lyricElements[lyricElem].childNodes[1].nodeName == 'DIV' && lyricElements[lyricElem].childNodes[1].className == 'card-content white-text') {
            var lyricType = lyricElements[lyricElem].childNodes[1].childNodes[1].childNodes[0].innerHTML.split(' ')[0];
            musixContent += `#${lyricType.toUpperCase()}\n`;
        } else {
            var lyricType = lyricElements[lyricElem].childNodes[0].childNodes[0].childNodes[0].innerHTML.split(' ')[0];
            musixContent += `#${lyricType.toUpperCase()}\n`;
        }

        if(lyricElements[lyricElem].childNodes[1].nodeName == 'DIV' && lyricElements[lyricElem].childNodes[1].className == 'card-content white-text') {
            var lyricContent = lyricElements[lyricElem].childNodes[1].childNodes[3].childNodes[1].value;
            if(lyricType !== 'Instrumental') musixContent += `${lyricContent}\n\n`;
        } else {
            var lyricContent = lyricElements[lyricElem].childNodes[0].childNodes[1].childNodes[0].value;
            if(lyricType !== 'Instrumental') musixContent += `${lyricContent}\n\n`;
        }
    }

    download('musixmatch.txt', musixContent);

}

function exportToJSON() {

    var lyricElements = document.getElementsByClassName('lyric-card');
    lyricElements = Array.prototype.slice.call(lyricElements);

    var jsonContent = {};
    var lyricArray = [];

    for(lyricElem in lyricElements) {
        if(lyricElements[lyricElem].nodeName !== 'DIV') return;

        if(lyricElements[lyricElem].childNodes[1].nodeName == 'DIV' && lyricElements[lyricElem].childNodes[1].className == 'card-content white-text') {
            var lyricType = lyricElements[lyricElem].childNodes[1].childNodes[1].childNodes[0].innerHTML.split(' ')[0];
            lyricArray.push(JSON.parse(`{"type": "${lyricType}"}`));
        } else {
            var lyricType = lyricElements[lyricElem].childNodes[0].childNodes[0].childNodes[0].innerHTML.split(' ')[0];
            lyricArray.push(JSON.parse(`{"type": "${lyricType}"}`));
        }

        if(lyricElements[lyricElem].childNodes[1].nodeName == 'DIV' && lyricElements[lyricElem].childNodes[1].className == 'card-content white-text') {
            var lyricContent = lyricElements[lyricElem].childNodes[1].childNodes[3].childNodes[1].value;
            if(lyricType !== 'Instrumental') lyricArray[lyricElem].content = lyricContent;
        } else {
            var lyricContent = lyricElements[lyricElem].childNodes[0].childNodes[1].childNodes[0].value;
            if(lyricType !== 'Instrumental') lyricArray[lyricElem].content = lyricContent;
        }
    }

    lyricArray = JSON.stringify(lyricArray);

    jsonContent = JSON.parse(`{"lyrics": ${lyricArray}}`);

    jsonContent = JSON.stringify(jsonContent, undefined, 2);

    download('lyrics.json', jsonContent);
}

function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

function switchToFreeform() {

    var lyricElements = document.getElementsByClassName('lyric-card');
    lyricElements = Array.prototype.slice.call(lyricElements);

    var freeformContent = '';

    for(lyricElem in lyricElements) {
        if(lyricElements[lyricElem].nodeName !== 'DIV') return;

        if(lyricElements[lyricElem].childNodes[1].nodeName == 'DIV' && lyricElements[lyricElem].childNodes[1].className == 'card-content white-text') {
            var lyricType = lyricElements[lyricElem].childNodes[1].childNodes[1].childNodes[0].innerHTML.split(' ')[0];
        } else {
            var lyricType = lyricElements[lyricElem].childNodes[0].childNodes[0].childNodes[0].innerHTML.split(' ')[0];
        }

        if(lyricElements[lyricElem].childNodes[1].nodeName == 'DIV' && lyricElements[lyricElem].childNodes[1].className == 'card-content white-text') {
            var lyricContent = lyricElements[lyricElem].childNodes[1].childNodes[3].childNodes[1].value;
            if(lyricType !== 'Instrumental') freeformContent += `${lyricContent}\n\n`;
        } else {
            var lyricContent = lyricElements[lyricElem].childNodes[0].childNodes[1].childNodes[0].value;
            if(lyricType !== 'Instrumental') freeformContent += `${lyricContent}\n\n`;
        }

        deleteLyricElement(lyricElements[lyricElem].id);
    }

    document.getElementById('addNewDropdownTrigger').remove();
    document.getElementById('switchToFreeformTrigger').remove();
    document.getElementById('exportButton').remove();

    document.getElementById('freeformEditor').style.display = 'block';

}

function findRhymes(word) {
    var http = new XMLHttpRequest();
    http.open('GET', `https://api.datamuse.com/words?rel_rhy=${word}`, false);
    http.send(null);
    return JSON.parse(http.responseText);
}

function removeRhymeRows() {
    var rows = document.getElementById('rhymingResultsRows').getElementsByClassName('row');
    rows = Array.prototype.slice.call(rows);

    for(row in rows) {
        currentRow = rows[row];

        currentRow.remove();
    }
}

function getRhymes() {

    removeRhymeRows();

    const word = document.getElementById('rhymeSearch').value;
    if(!word) return;

    const rhymes = findRhymes(word);
    console.log(rhymes);

    var buttonNum = 0;
    var rowExists = false;
    var rowElement;

    for(rhyme in rhymes) {
        const rhymeWord = rhymes[rhyme].word;

        if(!rowExists) {
            rowElement = document.createElement('div');
            rowElement.classList.add('row');
            document.getElementById('rhymingResultsRows').appendChild(rowElement);
            rowExists = true;

            addButtonToRow(rhymeWord);
        } else{
            addButtonToRow(rhymeWord);
        }

    }

    function addButtonToRow(rhymeWord) {
        buttonNum += 1;
        var buttonElement = document.createElement('a');
        buttonElement.classList.add('btn-flat', 'waves-effect', 'col', 's3', 'center');
        buttonElement.innerHTML = rhymeWord;
        buttonElement.onclick = (ev) => {
            navigator.clipboard.writeText(rhymeWord);
            M.toast({html: 'Successfully copied to the clipboard.', classes: 'green'});
            M.Modal.getInstance(document.getElementById('rhymingModal')).close();
        }
        rowElement.appendChild(buttonElement);

        if(buttonNum >= 4) {
            buttonNum = 0;
            rowExists = false;
        }
    }

}

function copyText(textareaId) {
    navigator.clipboard.writeText(document.getElementById(textareaId).value);
    M.toast({html: 'Successfully copied lyrics to the clipboard.', classes: 'green'})
}