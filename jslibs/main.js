if ('serviceWorker' in navigator) {
	console.log('CLIENT: service worker registration in progress.');
	navigator.serviceWorker.register('/sw.js').then(function() {
		console.log('CLIENT: service worker registration complete.');
	}, function() {
		console.log('CLIENT: service worker registration failure.');
	});
} else {
	console.log('CLIENT: service worker is not supported.');
}

let form_data = {}
let positions = {
	nume : [56.808, 39.195],
	prenume : [119.267,39.195],
	data_nastere_ziua : [56.42,48.206],
	data_nastere_luna : [71.501,48.206],
	data_nastere_an : [86.582,48.206],
	adresa_linia_1 : [56.102, 57.217],
	adresa_linia_2 : [56.102, 66.228],
	adresa_deplasare : [19.995, 94.821],
	motivul_deplasarii_1 : [32.409, 123.503],
	motivul_deplasarii_2 : [32.409, 134.367],
	motivul_deplasarii_3 : [32.409, 145.2],
	motivul_deplasarii_4 : [32.409, 151],
	motivul_deplasarii_5 : [32.409, 161.6],
	motivul_deplasarii_6 : [32.409, 172.7],
	motivul_deplasarii_6_1 : [38.12, 175.174],
	motivul_deplasarii_7 : [32.409, 184],
	motivul_deplasarii_8 : [32.409, 189.7],
	motivul_deplasarii_9 : [32.409, 195.3],
	motivul_deplasarii_10 : [32.409, 200.965],
	data_completare : [56.308, 236],
	semnatura : [125, 231.809],
}

$(function () {

	var $sigcontainer = $("#signature-container")
	var $sigreset = $("#signature-reset")
	var $sigdiv = $("#signature")
	$sigdiv.jSignature()
	$sigreset.click(function(e){$sigdiv.jSignature('reset')})
	$sigdiv.on('change', function(e){
		// $sigdata = $(this).jSignature('getData','svgbase64')
		$sigdata = $(this).jSignature('getData')
		if($sigdata[1].length == 312) {
			$("#signature-container :input").val('');
		} else {
			$("#signature-container :input").val($sigdata);
		}
		
	})

	$("#delaratie").submit(function(e){
		$('#loading-container').toggleClass('invisible')
		e.preventDefault()
		data = $(this).serializeArray()
		var data_completare = new Date().toJSON().slice(0,10).split('-').reverse().join('.');

		var doc = new jsPDF('p', 'mm', 'a4', true);
		doc.addFileToVFS("Merriweather_Regular.ttf", Merriweather_Regular);
    	doc.addFont('Merriweather_Regular.ttf', 'Merriweather_Regular', 'normal');
    	doc.setFont('Merriweather_Regular');
		doc.setFontSize(11);
		// doc.setTextColor('#004890');
		doc.addImage(background, 'PNG', 0, 0, 210, 297);

		for(var field in data) {
			if(typeof positions[data[field].name] !== 'undefined') {
				if (data[field].value == 'check') {
					doc.circle(positions[data[field].name][0] + 1.5, positions[data[field].name][1] + 1.5, 2, 'F');
				} else if (data[field].name == 'semnatura') {
					var semnatura = doc.getImageProperties(data[field].value);
					var ratio = semnatura.width / semnatura.height;
					var height = 17;
					var width = height * ratio;
					doc.addImage(data[field].value, 'PNG', positions[data[field].name][0], positions[data[field].name][1] + 10 - height, width, height);
				} else {
					doc.text(positions[data[field].name][0] + 1, positions[data[field].name][1] + 5, data[field].value);
				}
				form_data[data[field].name] = data[field].value;
			}
		}

		doc.text(positions['data_completare'][0], positions['data_completare'][1], data_completare);

		// doc.save(form_data.nume + ' ' +form_data.prenume + ' - DECLARAȚIE PE PROPRIE RĂSPUNDERE cf. Ordonanța Militară nr. 3/2020.pdf')
		var docname = form_data.nume + ' ' +form_data.prenume + ' - DECLARAȚIE PE PROPRIE RĂSPUNDERE cf. Ordonanța Militară nr. 3/2020.pdf';
		doc.save(docname, { returnPromise: true }).then( setTimeout(function(){ $('#loading-container').toggleClass('invisible') }, 700) );
	})
})