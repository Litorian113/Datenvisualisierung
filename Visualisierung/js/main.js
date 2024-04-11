let stageHeight;
let stageWidth;
let renderer;

$(function () {
    renderer = $('#renderer');
    stageHeight = renderer.innerHeight();
    stageWidth = renderer.innerWidth();

    prepareData();
    drawMap();
});

function prepareData() {

    positionData.forEach(posCountry => {
        populationData.forEach(popCountry => {
            if (posCountry.alpha3Code === popCountry.alpha3Code) {
                posCountry.population = popCountry.population;
            }
        });
    });
}

function drawMap() {

    const populationMax = gmynd.dataMax(positionData, "population");
    console.log("population max: " + populationMax);

    positionData.forEach(country => {
        const area = gmynd.map(country.population, 0, populationMax, 5, 1000);
        const r = gmynd.circleRadius(area)

        const x = gmynd.map(country.longitude, -180, 180, 0, stageWidth);
        const y = gmynd.map(country.latitude, 90, -90, 0, stageHeight);

        let dot = $('<div></div>');
        dot.attr('country', country.country)

        dot.mouseover( function (event) {
            $(this).addClass('hover')
            $('#hoverLabel').text(country.country)
        })
        dot.mouseout( function (event) {
            $(this).removeClass('hover')
            $('#hoverLabel').text(country.country)
        })

        dot.click(function (showLabel) {
            $('.clickk').removeClass('clickk')
            $(this).addClass('clickk')
            $('#clickLabel').text(`${country.country}: ${country.population
            }`)
        })

        let prozentAnteil = (country.population / populationMax) * 100
        if(prozentAnteil <= 5) {
            dot.css('background-color', 'green')
        }else if(prozentAnteil > 5 && prozentAnteil <= 50) {
            dot.css('background-color', 'yellow')
        }else{
            dot.css('background-color', 'red')
        }


        // mouseout


        // mouseclick

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