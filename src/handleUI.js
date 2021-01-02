let tensionLength = 4;
let gradesList = [];
let alterationList = ["","m","6", "m6", "7","m7","9","m9","11","m11","sus2","sus4","aug"];
let alterationListPretty = ["Major","Minor","Sixth", "Minor Sixth", "Seventh","Minor Seventh","Ninth","Minor Ninth","Elevnth","Minor Eleventh","Suspended Second","Suspended Fourth","Augmented"];
let output = {};
let iter = 0;
let select = 0;
let time = 3000;
let lastPlayedChord = [];
let octave = 3;
let duration = 4;

$(".addChord").click(function() {
    document.getElementById("chordsPool").appendChild(createChord());
    updateValues();
});

$(".addSequence").click(function() {
    document.getElementById("sequencesPool").appendChild(createSequence());
    updateValues();
});

$("#comp").submit(function(e){
    return false;
});


function createSequence(){
    let seqContainer = document.createElement("div");
    seqContainer.setAttribute("class", "sequence");
    let titleDiv = document.createElement("div");
    titleDiv.setAttribute("class", "title");
    titleDiv.appendChild(createIndexLabel(0));
    titleDiv.appendChild(createLenghtSelector());
    //titleDiv.appendChild(createPlaySeq());
    seqContainer.appendChild(titleDiv);
    seqContainer.appendChild(createRemoveButton("sequence"));
    return seqContainer;
}

function updateSequenceUI(sequenceElement){
    let length = $(sequenceElement).find("#length")[0].value;
    let stepElements = $(sequenceElement).find(".step");
    let actualLength = stepElements.length;
    if(actualLength == null || actualLength == undefined) actualLength = 0;
    if(actualLength < length){
        for(let i = actualLength; i < length; i++){
            sequenceElement.appendChild(createSequenceStep(i));
        }
    }
    if(actualLength > length){
        for(let i = actualLength; i > length -1; i--){
            $(stepElements[i]).remove();
        }
    }
    updateChordSelectionUI(sequenceElement);
    return length;
}

function updateChordSelectionUI(sequenceElement){
    let allSteps = $(sequenceElement).find(".step");
    for(let i = 0; i < allSteps.length; i++){
        let allSelectors = $(allSteps[i]).find("#chord-sel");
        for(let s = 0; s < allSelectors.length; s++){
            let oldValue = allSelectors[s].value;
            $(allSelectors[s]).empty()
            for(let c = 0; c < output.pool.length; c++){
                let option = document.createElement("option");
                option.value = c;
                option.innerHTML = c + 1;
                allSelectors[s].appendChild(option);
            }
            if(oldValue <= output.pool.length) allSelectors[s].value = oldValue;
        }
    }
}

function createPlaySeq(){
    let playButton = document.createElement("button");
    playButton.innerHTML = "Play Sequence";
    $(playButton).click(function () {
        let id = $($(this).parent()[0]).parent()[0].index;
        playSequence(id);
        return true;
    });
    return playButton;
}

function createSequenceStep(index){
    let stepContainer = document.createElement("div");
    stepContainer.setAttribute("class", "step");
    stepContainer.appendChild(createIndexLabel(index));
    stepContainer.appendChild(createChordSelector());
    stepContainer.appendChild(createTensionSelector());
    stepContainer.appendChild(createResult());
    return stepContainer;
}

function createTensionSelector(){
    let tensionSelContainer = document.createElement("div");
    let label = document.createElement("label");
    label.innerHTML = "Tension";
    tensionSelContainer.appendChild(label);
    let select = document.createElement("select");
    select.setAttribute("class", "tension-sel");
    for(let i = 0; i < tensionLength; i++){
        let option = document.createElement("option");
        option.value = i;
        option.innerHTML = i;
        select.appendChild(option);
    }
    $(select).on('input', function(){
        updateValues();
    });
    tensionSelContainer.appendChild(select);
    return tensionSelContainer;
}

function createChordSelector(){
    let chordSelContainer = document.createElement("div");
    let label = document.createElement("label");
    label.innerHTML = "Chord";
    chordSelContainer.appendChild(label);
    let select = document.createElement("select");
    select.id = "chord-sel";
    let chordPool = $(".chord");
    for(let i = 0; i < chordPool.length; i++){
        let option = document.createElement("option");
        option.value = i;
        option.innerHTML = i;
        select.appendChild(option);
    }
    $(select).on('input', function(){
        updateValues();
    });
    chordSelContainer.appendChild(select);
    return chordSelContainer;
}

function createLenghtSelector(){
    let lengthContainer = document.createElement("div");
    let label = document.createElement("label");
    label.innerHTML = "Length";
    lengthContainer.appendChild(label);
    let select = document.createElement("select");
    select.id = "length";
    for(let i = 0; i < 8; i++){
        let option = document.createElement("option");
        option.value = i + 1;
        option.innerHTML = i + 1    ;
        select.appendChild(option);
    }
    $(select).on('input', function(){
        updateValues();
    });
    lengthContainer.appendChild(select);
    return lengthContainer;
}

function createChord(){
    let chordContainer = document.createElement("div");
    chordContainer.setAttribute("class", "chord");
    chordContainer.appendChild(createIndexLabel(0));
    chordContainer.appendChild(createRemoveButton("chord"));
    chordContainer.appendChild(createGradeSelector());
    for(let t = 0; t < tensionLength; t++){
        chordContainer.appendChild(createAlterationSelector(t));
        chordContainer.appendChild(createPlayButton(t));
    }
    return chordContainer;
}

function createIndexLabel(index){
    let label = document.createElement("label");
    label.setAttribute("class", "index");
    label.innerHTML = "Index: " + index;
    return label;
}

function createResultLabel(){
    let label = document.createElement("label");
    label.setAttribute("class", "result");
    return label;
}

function createGradeSelector(){
    let gradeContainer = document.createElement("div");
    let label = document.createElement("label");
    label.innerHTML = "Grade";
    gradeContainer.appendChild(label);
    let select = document.createElement("select");
    select.setAttribute("class", "grade-sel");
    for(let i = 0; i < gradesList.length; i++){
        let option = document.createElement("option");
        option.value = i;
        option.innerHTML = gradesList[i];
        select.appendChild(option);
    }
    $(select).on('input', function(){
        updateValues();
    });
    gradeContainer.appendChild(select);
    return gradeContainer;
}

function createAlterationSelector(index){
    let tensionContainer = document.createElement("div");
    tensionContainer.setAttribute("class", "alteration-pool")
    let label = document.createElement("label");
    label.setAttribute("class", "tension-label");
    label.innerHTML = "T" + index;
    tensionContainer.appendChild(label);
    let select = document.createElement("select");
    select.setAttribute("class","tension-sel");
    for(let i = 0; i < alterationList.length; i++){
        let option = document.createElement("option");
        option.value = alterationList[i];
        option.innerHTML = alterationListPretty[i];
        select.appendChild(option);
    }
    $(select).on('input', function(){
        updateValues();
    });
    tensionContainer.appendChild(select);
    tensionContainer.appendChild(createResult());
    return tensionContainer;
}

function createResult(){
    let resultDiv = document.createElement("div");
    resultDiv.id = "result";
    let nameLabel = document.createElement("label");
    nameLabel.setAttribute("class", "result-name");
    resultDiv.appendChild(nameLabel);
    let noteLabel = document.createElement("label");
    noteLabel.setAttribute("class", "result-notes");
    resultDiv.appendChild(noteLabel);
    return resultDiv;
}


function createRemoveButton(string){
    let removeButton = document.createElement("button");
    removeButton.innerHTML = "Remove " + string;
    $(removeButton).click(function() {
        $(this).parent().remove();
        updateValues();
        return false;
    });
    return removeButton;
}
function createPlayButton(tension){
    let playButton = document.createElement("button");
    playButton.setAttribute("class", "play-chord");
    playButton.innerHTML = "Play";
    playButton.tension = tension;
    $(playButton).click(function () {
        let id = $(this).parent()[0].index;
        play(id, this.tension);
        return false;
    });
    return playButton;
}

function updateValues(){
    //INSTRUMENT INFO
    octave = $("#octave")[0].value;
    duration = $("#duration")[0].value;
    
    //COMP INFO
    let title = $("#title")[0].value;
    let root = $("#root")[0].value;
    let key = $("#key")[0].value;
    output.title = title;
    output.root = root;
    output.key = key;
    if(key == "Maj") gradesList = Tonal.Key.majorKey(root).grades;
    else if(key == "MinHarmonic")gradesList = Tonal.Key.minorKey(root).harmonic.grades;
    else if(key == "MinMelodic")gradesList = Tonal.Key.minorKey(root).melodic.grades;
    else if(key == "MinNatural")gradesList = Tonal.Key.minorKey(root).natural.grades;

    //POOL
    let allChords = $(".chord");
    let resultStrings = new Array(tensionLength);
    for(let t = 0; t < tensionLength; t++){
        resultStrings[t] = new Array(allChords.length);    
        for(let i = 0; i < allChords.length; i++){
            allChords[i].index = i;
            $(allChords[i]).find(".index")[0].innerHTML = "Index: " + (i + 1);
            let gradeSel = $(allChords[i]).find(".grade-sel")[0].value;
            let grade = gradesList[gradeSel];
            let add = $(allChords[i]).find(".tension-sel")[t].value
            resultStrings[t][i] = grade + add;
            
        }
    }
    output.pool = new Array(allChords.length)
    let leadsheets = new Array(tensionLength);
	for(let t = 0; t < tensionLength; t++) leadsheets[t] = Tonal.Progression.fromRomanNumerals(root, resultStrings[t]);
	for(let i = 0; i < allChords.length; i++){
        output.pool[i] = {};
		output.pool[i].index = i;
		output.pool[i].tension = new Array(tensionLength);
		for(let t = 0; t < tensionLength; t++){
            let resultChord = Tonal.Chord.get(leadsheets[t][i]);
			output.pool[i].tension[t] = {};
			output.pool[i].tension[t].name = resultChord.name;
            output.pool[i].tension[t].notes = resultChord.notes.map(Tonal.Note.chroma);
            $(allChords[i]).find(".result-name")[t].innerHTML = output.pool[i].tension[t].name ;
            $(allChords[i]).find(".result-notes")[t].innerHTML = String(output.pool[i].tension[t].notes);
            let gradeSelectors = $(allChords[i]).find(".grade-sel");
            for(let s = 0; s < gradeSelectors.length; s++){
                let oldValue = gradeSelectors[s].value;
                $(gradeSelectors[s]).empty();
                for(let i = 0; i < gradesList.length; i++){
                    let option = document.createElement("option");
                    option.value = i;
                    option.innerHTML = gradesList[i];
                    gradeSelectors[s].appendChild(option);
                }
                gradeSelectors[s].value = oldValue;
            }
		}
    }

    //SEQUENCES
    let allSequences = $(".sequence");
    output.sequences = new Array(allSequences.length);
    for(let i = 0; i < allSequences.length; i++){
        let thisSequence = allSequences[i];
        let length = updateSequenceUI(thisSequence);
        $(thisSequence)[0].index = i;
        output.sequences[i] = {};
        output.sequences[i].index = i;
        output.sequences[i].chords = new Array(length);
        for (let s = 0; s < length; s++){
            let thisStep = $(thisSequence).find(".step")[s];
            let chordSelection = $(thisStep).find("#chord-sel")[0].value;
            let tensionSelection = $(thisStep).find(".tension-sel")[0].value;
            output.sequences[i].chords[s] = output.pool[chordSelection].tension[tensionSelection];
            let thisResult = $(thisStep).find("#result")[0];
            if(output.sequences[i].chords[s]){
                $(thisResult).find(".result-name")[0].innerHTML =  output.sequences[i].chords[s].name;
                $(thisResult).find(".result-notes")[0].innerHTML =  output.sequences[i].chords[s].notes;
            }
            //console.log($($(thisSequence).find(".step")[s]).find("#chord-sel")[0]);
        }
    }
}

function export_output(){
    download(output, output.title + ".json", "application/json");
}

function download(content, fileName, contentType) {
    var a = document.createElement("a");
    var file = new Blob([JSON.stringify(content, null, 2)], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}

function makeNoise(notes){
    let piano = $("#piano-viz")[0];
    for(let i = 0; i < lastPlayedChord.length; i++) piano.setNoteUp(lastPlayedChord[i].note, 0);
    lastPlayedChord = new Array(notes.length);
    for(var i = 0; i < notes.length; i++){
        Synth.setSampleRate(44100); // sets sample rate to 20000Hz
        Synth.setVolume(0.1337); // even better.
        let note = Tonal.Midi.midiToNoteName(notes[i], { pitchClass: true, sharps: true });
        console.log(note);
        Synth.play("piano", note, octave, duration);
        piano.setNoteDown(note, 0);
        lastPlayedChord[i] = {};
        lastPlayedChord[i].note = note;
        //lastPlayedChord[i].octave = octave;
    }
}

function play(id, t) {
    let notes =  [];
    console.log("id: " + id + " t: " + t);
   
    notes = output.pool[id].tension[t].notes;
    makeNoise(notes);
}

function matchGrades(){
    if($(".chord").length < gradesList.length){
        for(let i = $(".chord").length; i < gradesList.length; i++){
            let newChord = createChord();
            $(newChord).find(".grade-sel")[0].value = i;
            //let tensions = $(newChord).find(".tension-sel");
            //console.log(tensions);
            //for(let t = 0; t < tensions.length; t++) tensions[t].value = alterationList[Number(Math.random() * alterationList.length).toFixed(0)];
            document.getElementById("chordsPool").appendChild(newChord);
        }
    }
    updateValues();
}
function randomAlterations(){
    let tensions = $(".tension-sel");
    for(let t = 2; t < tensions.length; t++) tensions[t].value = alterationList[Number((Math.random() * (alterationList.length -3)) + 2).toFixed(0)];
    for(let t = 0; t < tensions.length; t+=4) tensions[t].value = alterationList[0];
    for(let t = 1; t < tensions.length; t+=4) tensions[t].value = alterationList[1];
    updateValues();     
}