let tensionLength = 4;
let gradesList = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];
let typesList = ["","m","6", "m6", "7","m7","9","m9","11","m11","sus2","sus4","aug"];
let typesListPretty = ["Major","Minor","Sixth", "Minor Sixth", "Seventh","Minor Seventh","Ninth","Minor Ninth","Elevnth","Minor Eleventh","Suspended Second","Suspended Fourth","Augmented"];
let output = {};

$(".add").click(function() {
    document.getElementById('sequence').appendChild(createStep());
    updateValues();
});

$("#comp").submit(function(e){
    return false;
});


function createStep(){
    let stepContainer = document.createElement("div");
    stepContainer.setAttribute("class", "step");
    stepContainer.appendChild(createRemoveButton());
    stepContainer.appendChild(createIndexLabel());
    stepContainer.appendChild(createGradeSelector());
    for(let t = 0; t < tensionLength; t++){
        stepContainer.appendChild(createTensionSelector(t));
        stepContainer.appendChild(createPlayButton(t));
    }
    return stepContainer;
}
function createIndexLabel(){
    let label = document.createElement("label");
    label.setAttribute("class", "index");
    return label;
}

function createGradeSelector(){
    let gradeContainer = document.createElement("div");
    let label = document.createElement("label");
    label.innerHTML = "Grade";
    gradeContainer.appendChild(label);
    let select = document.createElement("select");
    select.id = "grade";
    for(let i = 0; i < gradesList.length; i++){
        let option = document.createElement("option");
        option.value = gradesList[i];
        option.innerHTML = gradesList[i];
        select.appendChild(option);
    }
    $(select).on('input', function(){
        updateValues();
    });
    gradeContainer.appendChild(select);
    return gradeContainer;
}

function createTensionSelector(index){
    let tensionContainer = document.createElement("div");
    let label = document.createElement("label");
    label.innerHTML = "Tension_" + index;
    tensionContainer.appendChild(label);
    let select = document.createElement("select");
    select.id = "tension_" + index;
    for(let i = 0; i < typesList.length; i++){
        let option = document.createElement("option");
        option.value = typesList[i];
        option.innerHTML = typesListPretty[i];
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
    nameLabel.setAttribute("class", "name");
    resultDiv.appendChild(nameLabel);
    let noteLabel = document.createElement("label");
    noteLabel.setAttribute("class", "notes");
    resultDiv.appendChild(noteLabel);
    return resultDiv;
}

function createRemoveButton(){
    let removeButton = document.createElement("button");
    removeButton.innerHTML = "Remove Step";
    $(removeButton).click(function() {
        $(this).parent().remove();
        return false;
    });
    return removeButton;
}
function createPlayButton(tension){
    let playButton = document.createElement("button");
    playButton.innerHTML = "Play";
    playButton.tension = tension;
    $(playButton).click(function () {
        let id = $(this).parent()[0].index;
        console.log(id);
        play(id, this.tension);
        return false;
    });
    return playButton;
}

function updateValues(){
    let title = $("#title")[0].value;
    let key = $("#key")[0].value;
    let allsteps = $(".step");
    let resultStrings = new Array(tensionLength);
    for(let t = 0; t < tensionLength; t++){
        resultStrings[t] = new Array(allsteps.length);    
        for(let i = 0; i < allsteps.length; i++){
            allsteps[i].index = i;
            let grade = $(allsteps[i]).find("#grade")[0].value;
            let add = $(allsteps[i]).find("#tension_" + t)[0].value
            resultStrings[t][i] = grade + add;
        }
    }
    output.title = title;
    output.key = key;
    output.sequence = new Array(allsteps.length)
    let leadsheets = new Array(tensionLength);
	for(let t = 0; t < tensionLength; t++) leadsheets[t] = Tonal.Progression.fromRomanNumerals(key, resultStrings[t]);
	for(let i = 0; i < allsteps.length; i++){
		output.sequence[i] = {};
		output.sequence[i].index = i;
		output.sequence[i].tension = new Array(tensionLength);
		for(let t = 0; t < tensionLength; t++){
			let resultChord = Tonal.Chord.get(leadsheets[t][i]);
			output.sequence[i].tension[t] = {};
			output.sequence[i].tension[t].name = resultChord.name;
            output.sequence[i].tension[t].notes = resultChord.notes.map(Tonal.Note.chroma);
            $(allsteps[i]).find(".name")[t].innerHTML = output.sequence[i].tension[t].name ;
            $(allsteps[i]).find(".notes")[t].innerHTML = String(output.sequence[i].tension[t].notes);
		}
	}
	console.log(output);
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

function play(id, t) {
    let notes =  [];
    console.log("id: " + id + " t: " + t);
    notes = output.sequence[id].tension[t].notes;
    for(var i = 0; i < notes.length; i++){

        Synth.setSampleRate(44100); // sets sample rate to 20000Hz
        Synth.setVolume(0.1337); // even better.
        
        let note = Tonal.Midi.midiToNoteName(notes[i], { pitchClass: true, sharps: true });
        Synth.play("piano", note, 3, 2);
    }
}
