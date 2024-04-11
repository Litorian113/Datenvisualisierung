let stageHeight;
let stageWidth;
let renderer;

$(function () {
    renderer = $('#renderer');
    stageHeight = renderer.innerHeight();
    stageWidth = renderer.innerWidth();

    // prepareData();
    drawMap();
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

function drawMap() {

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
    dot.addClass('dot')

    dot.css({
        'height': r,
        'width': r,
        'left': x,
        'top': y
    });
    renderer.append(dot);

});
}