let stageHeight;
let stageWidth;
let renderer;

$(function () {
    renderer = $('#renderer');
    stageHeight = renderer.innerHeight();
    stageWidth = renderer.innerWidth();

    // prepareData();
    drawEarthquakeMap();
    drawTsunamiMap();
});

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
    const intensityMax = gmynd.dataMax(tsunamiData, "TS_INTENSITY");
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