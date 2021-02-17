let tensionLength = 4;
let gradesList = [];
let alterationList = ["","m", "°", "aug", "6", "m6", "7","m7","9","m9","11","m11","sus2","sus4"];
let alterationListPretty = ["Major","Minor", "Diminished", "Augmented", "Sixth", "Minor Sixth", "Seventh","Minor Seventh","Ninth","Minor Ninth","Eleventh","Minor Eleventh","Suspended Second","Suspended Fourth"];
let modalAlterationList = [];
let isModal = false;
let output = {};
output.root = 'C';
let iter = 0;
let select = 0;
let time = 3000;
let lastPlayedChord = [];
let octave = 3;
let duration = 4;
addFirstSequence();

function addFirstSequence(){
    document.getElementById("sequencesPool").appendChild(createSequence());
    updateValues();
}
$(".addChord").click(function() {
    document.getElementById("chordsPool").appendChild(createChord());
    updateValues();
});

$(".addSequence").click(function() {
    document.getElementById("sequencesPool").appendChild(createSequence());
    updateValues();
});
$("input").keypress(function (e) {
    if (e.which === 13) {
        e.preventDefault();
    }
});

$("#comp").submit(function(e){
    return false;
});


function createSequence(){
    let seqContainer = document.createElement("div");
    seqContainer.setAttribute("class", "sequence row");
    let titleDiv = document.createElement("div");
    titleDiv.setAttribute("class", "title row col");
    let indexLabel = createIndexLabel(0);
    indexLabel.setAttribute("class", "col")
    titleDiv.appendChild(indexLabel);
    let lenghtSel = createLenghtSelector();
    lenghtSel.setAttribute("class", "col");
    titleDiv.appendChild(lenghtSel);
    //titleDiv.appendChild(createPlaySeq());
    seqContainer.appendChild(titleDiv);
    //let remove = createRemoveButton("sequence");
    //remove.setAttribute("class", "col");
    //seqContainer.appendChild(remove);
    let tags = createTagSystem();
    tags.setAttribute("class", "row whole-tag");
    seqContainer.appendChild(tags);

    let stepsPool = document.createElement("div");
    stepsPool.setAttribute("class", "stepsPool row");
    seqContainer.appendChild(stepsPool);
    return seqContainer;
}

function createTagSystem(){
    let tagContainer = document.createElement("div");
    let label = document.createElement("label");
    label.innerHTML = "Tag";
    tagContainer.appendChild(label);
    let textBox = document.createElement("input");
    textBox.setAttribute("type", "textbox");
    textBox.setAttribute("class", "tag-input");
    $(textBox).keypress(function (e) {
        if (e.which === 13) {
            e.preventDefault();
            $($(this).parent().find(".tagPool"))[0].appendChild(newTag(this.value));
            this.value = "";
        }
    });
    tagContainer.appendChild(textBox);
    let tagPool = document.createElement("div");
    tagPool.setAttribute("class", "tagPool row");
    tagContainer.appendChild(tagPool);
    return tagContainer;
}

function newTag(tagName){
    let tagDiv = document.createElement("div");
    tagDiv.setAttribute("class", "col")
    let tag = document.createElement("label");
    tag.setAttribute("class", "tag col");
    tag.innerHTML = tagName;
    tagDiv.appendChild(tag);
    let remove = createRemoveButton("tag");
    remove.setAttribute("class", "col");
    tagDiv.appendChild(remove);
    return tagDiv;
}

function updateSequenceUI(sequenceElement){
    let length = $(sequenceElement).find("#length")[0].value;
    let stepElements = $(sequenceElement).find(".step");
    let actualLength = stepElements.length;
    if(actualLength == null || actualLength == undefined) actualLength = 0;
    if(actualLength < length){
        for(let i = actualLength; i < length; i++){
            $(sequenceElement).find(".stepsPool")[0].appendChild(createSequenceStep(i));
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

function createSequenceStep(index, chordSel, tensionSel){
    let stepContainer = document.createElement("div");
    stepContainer.setAttribute("class", "step col-md-1");
    stepContainer.appendChild(createIndexLabel(index));
    stepContainer.appendChild(createChordSelector(chordSel));
    //stepContainer.appendChild(createTensionSelector(tensionSel));
    stepContainer.appendChild(createResult());
    return stepContainer;
}

function createTensionSelector(defValue){
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
    if(defValue != undefined) select.value = defValue;
    tensionSelContainer.appendChild(select);
    return tensionSelContainer;
}

function createChordSelector(defValue){
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
    if(defValue != undefined) select.value = defValue;
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
    for(let i = 0; i < 16; i++){
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
    chordContainer.setAttribute("class", "chord fluid-container row col-md-3");
    let index = createIndexLabel(0);
    index.setAttribute("class", "index col-md-4");
    chordContainer.appendChild(index);
    let remove = createRemoveButton("chord");
    remove.setAttribute("class", "col-md-7");
    chordContainer.appendChild(remove);
    chordContainer.appendChild(createGradeSelector());
    for(let t = 0; t < tensionLength; t++){
        chordContainer.appendChild(createAlterationSelector(t));
        
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
    gradeContainer.setAttribute("class", "row");
    let label = document.createElement("label");
    label.setAttribute("class", "col");
    label.innerHTML = "Grade";
    gradeContainer.appendChild(label);
    let select = document.createElement("select");
    select.setAttribute("class", "grade-sel col-auto");
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
    tensionContainer.setAttribute("class", "alteration-pool row")
    let label = document.createElement("label");
    label.setAttribute("class", "tension-label col-md-2");
    label.innerHTML = "T" + index;
    tensionContainer.appendChild(label);
    let select = document.createElement("select");
    select.setAttribute("class","tension-sel col-md-4");
    for(let i = 0; i < modalAlterationList.length; i++){
        let option = document.createElement("option");
        option.value = i;
        option.innerHTML = modalAlterationList[i];
        select.appendChild(option);
    }
    $(select).on('input', function(){
        updateValues();
    });
    tensionContainer.appendChild(select);
    let res = createResult();
    res.setAttribute("class", "col-md-4")
    tensionContainer.appendChild(res);
    let play = createPlayButton(index);
    play.setAttribute("class", "col-md-2")
    tensionContainer.appendChild(play);
    return tensionContainer;
}

function createResult(){
    let resultDiv = document.createElement("div");
    resultDiv.id = "result";
    let nameLabel = document.createElement("label");
    nameLabel.setAttribute("class", "result-name");
    resultDiv.appendChild(nameLabel);
    //let noteLabel = document.createElement("label");
    //noteLabel.setAttribute("class", "result-notes");
    //resultDiv.appendChild(noteLabel);
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
        let id = $($(this).parent()).parent()[0].index;
        play(id, this.tension);
        return false;
    });
    return playButton;
}
function updateChords(){
    //POOL
    let allChords = $(".chord");
    let resultStrings = new Array(tensionLength);
    let resultSelection =  new Array(tensionLength);
    for(let t = 0; t < tensionLength; t++){
        resultStrings[t] = new Array(allChords.length);    
        resultSelection[t] =  new Array(allChords.length);
        for(let i = 0; i < allChords.length; i++){
            allChords[i].index = i;
            $(allChords[i]).find(".index")[0].innerHTML = "Index: " + (i + 1);
            resultSelection[t][i] = {};
            resultSelection[t][i].grade = $(allChords[i]).find(".grade-sel")[0].value;
            resultSelection[t][i].tension = $(allChords[i]).find(".tension-sel")[t].value;
            resultStrings[t][i] = gradesList[resultSelection[t][i].grade] + modalAlterationList[resultSelection[t][i].tension];
        }
    }
    output.pool = new Array(allChords.length)
    let leadsheets = new Array(tensionLength);
    /*
    if(!isModal) for(let t = 0; t < tensionLength; t++) leadsheets[t] = Tonal.Progression.fromRomanNumerals(output.root, resultStrings[t]);
    else {
        leadsheets = resultStrings;
        for (let t = 0; t < tensionLength; t++) {
            for (let i = 0; i < resultStrings[t].length; i++){
               // leadsheets[t][i] = resultStrings[t
            }
        }
    }
    */
	for(let i = 0; i < allChords.length; i++){
        output.pool[i] = {};
		output.pool[i].selection = gradesList[resultSelection[0][i].grade];
		output.pool[i].tension = new Array(tensionLength);
		for(let t = 0; t < tensionLength; t++){
            let resultChord = Tonal.Chord.get(resultStrings[t][i]);
            output.pool[i].tension[t] = {};
		    output.pool[i].tension[t].selection = modalAlterationList[resultSelection[t][i].tension];
			output.pool[i].tension[t].name = resultChord.name;
            output.pool[i].tension[t].notes = checkOctave(resultChord.notes.map(Tonal.Note.chroma));

            $(allChords[i]).find(".result-name")[t].innerHTML = output.pool[i].tension[t].name ;
            //$(allChords[i]).find(".result-notes")[t].innerHTML = String(output.pool[i].tension[t].notes);
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
}

function checkOctave(inputNotes){
    let outputNotes = new Array(inputNotes.length);
    outputNotes[0] = inputNotes[0];
    let oct = 0;
    for(let n = 1; n < inputNotes.length; n++){
        // [ 0, 4, 7, 10, 2, 9 ]
        if(inputNotes[n - 1] > inputNotes[n]) oct++; 
        outputNotes[n] = inputNotes[n] + 12 * oct;
    }
    return outputNotes;
}

function updateSequences(){
    //SEQUENCES
    let allSequences = $(".sequence");
    output.sequences = new Array(allSequences.length);
    for(let i = 0; i < allSequences.length; i++){
        let thisSequence = allSequences[i];
        let length = updateSequenceUI(thisSequence);
        $(thisSequence)[0].index = i;
        output.sequences[i] = {};
        output.sequences[i].chords = new Array(length);
        for (let s = 0; s < length; s++){
            let allTags = $($(thisSequence).find(".tag"));
            output.sequences[i].tag = new Array(allTags.length);
            for(let t = 0; t < allTags.length; t++){
                output.sequences[i].tag[t] = allTags[t].innerHTML;
            }
            let thisStep = $(thisSequence).find(".step")[s];
            let chordSelection = $(thisStep).find("#chord-sel")[0].value;
            //let tensionSelection = $(thisStep).find(".tension-sel")[0].value;
            output.sequences[i].chords[s] = {};
            output.sequences[i].chords[s].index = chordSelection;
            //output.sequences[i].chords[s].tension = tensionSelection;
            let thisResult = $(thisStep).find("#result")[0];
            if(output.pool[chordSelection] != undefined){
                //$(thisResult).find(".result-name")[0].innerHTML =  output.pool[chordSelection].tension[tensionSelection].name;
                //$(thisResult).find(".result-notes")[0].innerHTML =  output.pool[chordSelection].tension[tensionSelection].notes;
            }
            //console.log($($(thisSequence).find(".step")[s]).find("#chord-sel")[0]);
        }
    }
}

function getModeAlterations(string){
    let out = [];
    if(string != "melodic minor" && string != "natural minor" && string != "harmonic minor" ){
        out = Tonal.Mode.triads(string);
        //out = new Array(allAlterations.length);
        for(let i = 0; i < out.length; i++){
            if(out[i] == "") out[i] = "M";
        }
    }
    else{
        let allAlterations = [];
        if(string != "minor"){
            let res = Tonal.Key.minorKey(output.root);
            if(string == "harmonic minor") allAlterations = res.harmonic.chords;
            else if(string == "melodic minor") allAlterations = res.melodic.chords;
            else if(string == "natural minor") allAlterations = res.natural.chords;
            out = new Array(allAlterations.length);
            for(let i = 0; i < allAlterations.length; i++){
                out[i] =  Tonal.Chord.get(allAlterations[i]).aliases[0];
            }
        }
    }
    return out;
}

function updateMain(){
    //INSTRUMENT INFO
    octave = $("#octave")[0].value;
    duration = $("#duration")[0].value;

    //COMP INFO
    output.title  = $("#title")[0].value;
    output.root = 'C';
    output.key = $("#key")[0].value;

    modalAlterationList = [];

    if(output.key == "major"){ 
        isModal = false;
        gradesList = Tonal.Key.majorKey(output.root).scale; 
        modalAlterationList = getModeAlterations("major");
    }
    else if(output.key == "harmonic minor"){ 
        isModal = false;
        gradesList = Tonal.Key.minorKey(output.root).harmonic.scale;
        modalAlterationList = [].concat(getModeAlterations("harmonic minor"), getModeAlterations("minor"));
    }
    else if(output.key == "melodic minor"){ 
        isModal = false;
        gradesList = Tonal.Key.minorKey(output.root).melodic.scale;
        modalAlterationList = [].concat(getModeAlterations("melodic minor"), getModeAlterations("minor"));
    }
    else if(output.key == "natural minor"){ 
        isModal = false;
        gradesList = Tonal.Key.minorKey(output.root).natural.scale;
        modalAlterationList = [].concat(getModeAlterations("natural minor"), getModeAlterations("minor"));
    }
    else {
        isModal = true;
        gradesList = Tonal.Mode.notes(output.key, output.root);
        modalAlterationList = getModeAlterations(output.key);
    }
    let others = Tonal.Scale.scaleChords(output.key);
    modalAlterationList = [].concat(modalAlterationList, others);
    modalAlterationList = Array.from(new Set(modalAlterationList));
    modalAlterationList = Tonal.ChordType.all().map(get => get.aliases[0]);
    modalAlterationList.sort();

    //console.log(Tonal.ChordType.all().map(get => get.aliases[0]));
}
function updateValues(){
    updateMain();
    updateChords();
    updateSequences();
}

function makeNoise(notes){
    let piano = $("#piano-viz")[0];
    for(let i = 0; i < lastPlayedChord.length; i++) {
        if(lastPlayedChord[i] != undefined) piano.setNoteUp(lastPlayedChord[i].note, lastPlayedChord[i].octave);
    }
    lastPlayedChord = new Array(notes.length);
    for(var i = 0; i < notes.length; i++){
        Synth.setSampleRate(44100); // sets sample rate to 20000Hz
        Synth.setVolume(0.1337); // even better.
        let note = Tonal.Midi.midiToNoteName(notes[i], { pitchClass: true, sharps: true });
        let actualOctave = parseInt(Math.floor(notes[i] / 12)) + parseInt(octave);
        console.log(notes);
        Synth.play("piano", note, actualOctave, duration);
        piano.setNoteDown(note, Math.floor(notes[i] / 12));
        lastPlayedChord[i] = {};
        lastPlayedChord[i].note = note;
        lastPlayedChord[i].octave = Math.floor(notes[i] / 12);
    }
}

function play(id, t) {
    let notes =  [];
    //console.log("id: " + id + " t: " + t);
   
    notes = output.pool[id].tension[t].notes;

    makeNoise(notes);
}

function autofill(){
    $("#sequencesPool").empty(); 
    updateMain();
  
    for(let i = 0; i < 1; i++){
        let newSequence = createSequence();
        $(newSequence).find("#length")[0].value = $(".chord").length;
        for(let c = 0; c < output.pool.length; c++){
            $(newSequence).find(".stepsPool")[0].appendChild(createSequenceStep(c, c, 0));
        }
        document.getElementById("sequencesPool").appendChild(newSequence);
        updateValues();
    }
    updateMain();
}

function matchGrades(){
    updateMain();
    $("#chordsPool").empty(); 
    for(let i = $(".chord").length; i < gradesList.length; i++){
        let newChord = createChord();
        $(newChord).find(".grade-sel")[0].value = i;
        if(isModal){
            $(newChord).find(".tension-sel")[0].value = modalAlterationList.indexOf(getModeAlterations(output.key)[i]);
        }
        else{
            let alt = getModeAlterations(output.key);
            //if(output.key == "major") alt = getModeAlterations("major"); 
            //else if(output.key == "harmonic minor") alt = getModeAlterations("minor"); 
            //else if(output.key == "melodic minor") alt = getModeAlterations("minor"); 
            //else if(output.key == "natural minor") alt = getModeAlterations("minor"); 
            $(newChord).find(".tension-sel")[0].value = modalAlterationList.indexOf(alt[i]);
        }

        document.getElementById("chordsPool").appendChild(newChord);
    }
    
    updateValues();
}

function randomAlterations(){
    let tensions = $($("#chordsPool").find(".tension-sel"));
    for(let t = 2; t < tensions.length; t++) tensions[t].value = Number((Math.random() * (alterationList.length -3)) + 2).toFixed(0);
    for(let t = 0; t < tensions.length; t+=4) tensions[t].value = 0;
    for(let t = 1; t < tensions.length; t+=4) tensions[t].value = 1;
    updateValues();     
}

function createFromJson(object){
    output = object;
    
    //COMP INFO
    $("#title")[0].value = output.title;
    //$("#root")[0].value = 'C';
    $("#key")[0].value = output.key;
    updateMain();

    let chordPool = $("#chordsPool");
    chordPool.empty();
    for(let i = 0; i < output.pool.length; i++){
        let newChord = createChord();
        $(newChord).find(".grade-sel")[0].value = gradesList.indexOf(output.pool[i].selection);
        let tensions = $($(newChord).find(".tension-sel"));
        for(let t = 0; t < output.pool[i].tension.length; t++){
            tensions[t].value = modalAlterationList.indexOf(output.pool[i].tension[t].selection);
        }
        document.getElementById("chordsPool").appendChild(newChord);
    }
    let sequencePool = $("#sequencesPool");
    sequencePool.empty();
    for(let i = 0; i < output.sequences.length; i++){
        let newSequence = createSequence();
        $(newSequence).find("#length")[0].value = output.sequences[i].chords.length;
        for(let c = 0; c < output.sequences[i].chords.length; c++){
            $(newSequence).find(".stepsPool")[0].appendChild(createSequenceStep(c, output.sequences[i].chords[c].index, 0));
        }
        for(let t = 0; t < output.sequences[i].tag.length; t++){
            $(newSequence).find(".tagPool")[0].appendChild(newTag(output.sequences[i].tag[t]));
        }
        document.getElementById("sequencesPool").appendChild(newSequence);
    }
    updateValues();
}


function import_json(){
	var files = document.getElementById('browse').files;
    if (files.length <= 0) {
      return false;
    }
    var fr = new FileReader();
    fr.onload = function(e) {
      var result = JSON.parse(e.target.result);
      var formatted = JSON.stringify(result, null, 2);
      createFromJson(result);
    }
    fr.readAsText(files.item(0));
}

function export_json(){
    download(output, output.title + ".json", "application/json");
}

function download(content, fileName, contentType) {
    var a = document.createElement("a");
    var file = new Blob([JSON.stringify(content, null, 2)], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}