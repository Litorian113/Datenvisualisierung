const data = [5, 2, 7, 3, 6, 4];
let renderer, stageHeight, stageWidth;

$(function () {
    renderer = $('#renderer')
    stageHeight = renderer.height()
    stageWidth = renderer.width()
    drawSundBurst();
})

function drawSundBurst() {
    const centerX = stageWidth / 2;
    const centerY = stageHeight / 2;


    const w = 20;

    for (let burstIndex = 0; burstIndex < data.length; burstIndex++) {
        // const radius = step * (burstIndex + 1); // Increase radius for each burst

        for (let segmentIndex = 0; segmentIndex < data[burstIndex]; segmentIndex++) {
            const angle = (360 / data.length) * (burstIndex + 1); // Calculate angle in degrees
            const radians = angle * (Math.PI / 180); // Convert angle to radians

            const radius = 360 - w * (segmentIndex)
            const x = centerX + Math.cos(radians) * radius;
            const y = centerY + Math.sin(radians) * radius;

            const dot = $('<div></div>')
            dot.addClass('dot')

            dot.css({
                'height': w,
                'width': w,
                'left': x,
                'top': y
            })
            console.log(burstIndex)

            renderer.append(dot)
        }
    }
}