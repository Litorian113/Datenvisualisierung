let stageHeight;
let stageWidth;
let renderer;

$(function () {
    renderer = $('#renderer');
    stageHeight = renderer.innerHeight();
    stageWidth = renderer.innerWidth();

    earthquakeData.forEach(function(item) {
        // Datum in Tag, Monat und Jahr aufteilen
        let dateParts = item["Date"].split(".");
        // Hinzufügen von Tag, Monat und Jahr zum Datensatz
        item["DAY"] = dateParts[0];
        item["MONTH"] = dateParts[1];
        let year = parseInt(dateParts[2]); // Konvertiere das Jahr in eine Zahl
        // Füge je nach Bedingung das entsprechende Jahr hinzu
        if (year <= 99 && year >= 65) {
            year += 1900;
        } else if (year >= 0 && year <= 16) {
            year += 2000;
        }
        item["YEAR"] = year.toString(); // Konvertiere das Jahr zurück in einen String und speichere es im Datensatz
        // Löschen des ursprünglichen Datums, falls erforderlich
        // delete item["Date"];
    });
    // Sortiere den Datensatz nach dem Wert des Schlüssels "YEAR" aufsteigend
tsunamiData.sort((a, b) => a.YEAR - b.YEAR);

// Filtere die Einträge basierend auf dem Wert des Schlüssels "YEAR"
tsunamiData = tsunamiData.filter(item => item.YEAR >= 1965 && item.YEAR <= 2016);


    // prepareData();
    drawEarthquakeMap();
    drawTsunamiMap();
});

$(function () {
    let stageHeight = $('#renderer').innerHeight();
    let stageWidth = $('#renderer').innerWidth();

    // Initialanzeige der Erdbeben-Events für das Jahr 1965
    // displayEarthquakes(1965);

    // Globale Variablen für gefilterte Daten initialisieren
let filteredEarthquakeData = [];
let filteredTsunamiData = [];

// Filterfunktion aufrufen, um Daten beim Laden der Seite zu filtern
filterData();

// Range Slider Event-Handler
$('#yearRange').on('input', function () {
    let selectedYear = $(this).val();
    $('#currentYear').text(selectedYear);
    // Funktion aufrufen, um Erdbeben- und Tsunami-Events für das ausgewählte Jahr anzuzeigen
    displayEvents(selectedYear);
});

// Funktion zum Filtern der Daten
function filterData() {
    // Erdbeben-Daten filtern
    filteredEarthquakeData = earthquakeData.filter(earthquakeEvent => {
        let eventYear = parseInt(earthquakeEvent.YEAR);
        return eventYear >= 1965 && eventYear <= 2016;
    });

    // Tsunami-Daten filtern
    filteredTsunamiData = tsunamiData.filter(tsunamiEvent => {
        let eventYear = parseInt(tsunamiEvent.YEAR);
        return eventYear >= 1965 && eventYear <= 2016;
    });
}

// Funktion zum Anzeigen der Erdbeben- und Tsunami-Events basierend auf dem ausgewählten Jahr
function displayEvents(selectedYear) {
    console.log("Selected Year:", selectedYear);
    // Vorhandene Punkte entfernen, die nicht dem ausgewählten Jahr entsprechen
    $('.dot, .dotTsu').remove();

    // Erdbeben-Events für das ausgewählte Jahr anzeigen
    filteredEarthquakeData.forEach(earthquakeEvent => {
        if (earthquakeEvent.YEAR === selectedYear) {
            // Anzeige des Erdbeben-Events
            const area = gmynd.map(earthquakeEvent.Magnitude, 0, 10, 80, 80);
            const r = gmynd.circleRadius(area);

            const x = gmynd.map(earthquakeEvent.Longitude, -180, 180, 0, stageWidth);
            const y = gmynd.map(earthquakeEvent.Latitude, 90, -90, 0, stageHeight);

            let dot = $('<div></div>');
            dot.attr('earthquakeEvent', earthquakeEvent.Magnitude);
            let magnitudeLevel = earthquakeEvent.Magnitude;
            if (magnitudeLevel <= 6) {
                dot.css('background-color', 'yellow')
            } else if (magnitudeLevel > 6 && magnitudeLevel <= 6.5) {
                dot.css('background-color', 'orange')
            } else {
                dot.css('background-color', 'red')
            }
            dot.addClass('dot');
            dot.css({
                'height': r,
                'width': r,
                'left': x,
                'top': y
            });
            $('#renderer').append(dot);
        }
    });

    // Tsunami-Events für das ausgewählte Jahr anzeigen
    filteredTsunamiData.forEach(tsunamiEvent => {
        if (tsunamiEvent.YEAR == selectedYear) {
            // Anzeige des Tsunami-Events
            const intensityMax = gmynd.dataMax(filteredTsunamiData, "TS_INTENSITY");

            const area = gmynd.map(tsunamiEvent.TS_INTENSITY, 0, intensityMax, 200, 200);
            const r = gmynd.circleRadius(area);

            const x = gmynd.map(tsunamiEvent.LONGITUDE, -180, 180, 0, stageWidth);
            const y = gmynd.map(tsunamiEvent.LATITUDE, 90, -90, 0, stageHeight);

            let dot = $('<div></div>');
            dot.attr('tsunamiEvent', tsunamiEvent.TS_INTENSITY);
            dot.addClass('dotTsu');
            dot.css({
                'height': r,
                'width': r,
                'left': x,
                'top': y
            });
            $('#renderer').append(dot);
        }
    });
    
    }
}); 
//     tsunamiData.forEach(tsunamiEvent => {
//         // Überprüfe, ob der Wert von "YEAR" größer oder gleich 1965 ist
//         if (tsunamiEvent.YEAR >= 1965) {
//             const area = gmynd.map(tsunamiEvent.TS_INTENSITY, 0, intensityMax, 200, 200);
//             const r = gmynd.circleRadius(area);

//             const x = gmynd.map(tsunamiEvent.LONGITUDE, -180, 180, 0, stageWidth);
//             const y = gmynd.map(tsunamiEvent.LATITUDE, 90, -90, 0, stageHeight);

//             let dot = $('<div></div>');
//             dot.attr('tsunamiEvent', tsunamiEvent.TS_INTENSITY);
//             dot.addClass('dotTsu');
//             dot.css({
//                 'height': r,
//                 'width': r,
//                 'left': x,
//                 'top': y
//             });
//             renderer.append(dot);
//         }
//     });
// }


// function prepareData() {

//     positionData.forEach(posCountry => {
//         populationData.forEach(popCountry => {
//             if (posCountry.alpha3Code === popCountry.alpha3Code) {
//                 posCountry.population = popCountry.population;
//             }
//         });
//     });
// }
function drawTsunamiMap() {
    let intensityMax = gmynd.dataMax(tsunamiData, "TS_INTENSITY");
    console.log("intensity max: " + intensityMax);

    tsunamiData.forEach(tsunamiEvent => {
        // Überprüfe, ob der Wert von "YEAR" größer oder gleich 1965 ist
        if (tsunamiEvent.YEAR >= 1965) {
            const area = gmynd.map(tsunamiEvent.TS_INTENSITY, 0, intensityMax, 200, 200);
            const r = gmynd.circleRadius(area);

            const x = gmynd.map(tsunamiEvent.LONGITUDE, -180, 180, 0, stageWidth);
            const y = gmynd.map(tsunamiEvent.LATITUDE, 90, -90, 0, stageHeight);

            let dot = $('<div></div>');
            dot.attr('tsunamiEvent', tsunamiEvent.TS_INTENSITY);
            dot.addClass('dotTsu');
            dot.css({
                'height': r,
                'width': r,
                'left': x,
                'top': y
            });
            renderer.append(dot);
        }
    });
}

function drawEarthquakeMap() {


const magnitudeMax = gmynd.dataMax(earthquakeData, "Magnitude");
console.log("magnitude max: " + magnitudeMax);

earthquakeData.forEach(earthquakeEvent => {
    const area = gmynd.map(earthquakeEvent.Magnitude, 0, magnitudeMax, 5, 10);
    const r = gmynd.circleRadius(area);

    const x = gmynd.map(earthquakeEvent.Longitude, -180, 180, 0, stageWidth);
    const y = gmynd.map(earthquakeEvent.Latitude, 90, -90, 0, stageHeight);

    let dot = $('<div></div>');
    dot.attr('earthquakeEvent', earthquakeEvent.Magnitude);


    dot.mouseover( function (event) {
        $(this).addClass('hover')
        $('#hoverLabel').text(earthquakeEvent.Magnitude)
    })
    dot.mouseout( function (event) {
        $(this).removeClass('hover')
        $('#hoverLabel').text(earthquakeEvent.Magnitude)
    })

    dot.click(function (showLabel) {
        $('.clickk').removeClass('clickk')
        $(this).addClass('clickk')
        $('#clickLabel').text(`${earthquakeEvent.Latitude}: ${earthquakeEvent.Longitude}`)
    })


//TODO Wie stark sollen die Grenzen sein.
    let magnitudeLevel = earthquakeEvent.Magnitude;
    if(magnitudeLevel <= 6) {
        dot.css('background-color', 'yellow')
    }else if(magnitudeLevel > 6 && magnitudeLevel <= 6.5) {
        dot.css('background-color', 'orange')
    }else{
        dot.css('background-color', 'red')
    }



    dot.addClass('dot')

    dot.css({
        'height': r,
        'width': r,
        'left': x,
        'top': y
    });
    renderer.append(dot);

});

// $('renderer').mousemove(function(event) {
//     $('#earthquakeInfoBox').css({
//         'top': event.pageY + 10,
//         'left': event.pageX + 10
//     });
// });

// $('body').append('<div id="earthquakeInfoBox"></div>');

// $('.dot').mouseover(function(event) {
//     const magnitude = $(this).attr('earthquakeEvent');
//     $('#earthquakeInfoBox').text('Magnitude: ' + magnitude).show();
// }).mouseout(function() {
//     $('#earthquakeInfoBox').hide();
// });
$('body').append('<div id="earthquakeInfoBox"></div>');

$('.dot').mouseover(function(event) {
    const magnitude = $(this).attr('earthquakeEvent');
    const mouseX = event.pageX;
    const mouseY = event.pageY;
    const boxWidth = $('#earthquakeInfoBox').outerWidth();
    const boxHeight = $('#earthquakeInfoBox').outerHeight();

    let posX = mouseX + 20; // 20px rechts von der Maus
    let posY = mouseY - boxHeight / 2; // Zentriert vertikal zur Maus

    // Prüfen, ob die Box außerhalb des rechten Bildschirmrandes liegt
    if (posX + boxWidth > $(window).width()) {
        posX = mouseX - boxWidth - 20; // 20px links von der Maus
    }

    // Prüfen, ob die Box außerhalb des oberen Bildschirmrandes liegt
    if (posY < 0) {
        posY = 0; // Oben ausgerichtet
    }

    $('#earthquakeInfoBox').text('Magnitude: ' + magnitude).css({
        'top': posY,
        'left': posX
    }).show();
}).mouseout(function() {
    $('#earthquakeInfoBox').hide();
});

}

$(document).ready(function() {
    $('#togglePanel').click(function() {
        $('.controlPanel').toggleClass('open'); /* Fügt oder entfernt die Klasse 'open' */
        $('#togglePanel').toggleClass('open'); /* Fügt oder entfernt die Klasse 'open' */
    });
});
