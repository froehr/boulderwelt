// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: pink; icon-glyph: magic;
let boulderweltShortName = 'muc-ost'
let param = args.widgetParameter
if (param != null && param.length > 0) {
    boulderweltShortName = param;
}

const textColor = new Color("#fff");
const timeFormatOptions = { year: 'numeric', month: 'numeric', day: 'numeric' };
const utilizationColors = {
    darkred: { limit: 100, color: '#c01a00' },
    red: { limit: 70, color: '#f92206' },
    orange: { limit: 60, color: '#faa31b' },
    yellow: { limit: 50, color: '#ffff64' },
    green: { limit: 0, color: '#00cc00' },
    gray: { limit: 0, color: '#d0d0d0' }
}

function getUtilizationColor(utilization) {
    let color = new Color(utilizationColors.green.color)
    if (utilization > utilizationColors.darkred.limit) {
        color = new Color(utilizationColors.darkred.color)
    } else if (utilization >= utilizationColors.red.limit) {
        color = new Color(utilizationColors.red.color)
    } else if (utilization >= utilizationColors.orange.limit) {
        color = new Color(utilizationColors.orange.color)
    } else if (utilization >= utilizationColors.yellow.limit) {
        color = new Color(utilizationColors.yellow.color)
    } else if (utilization === 0) {
        color = new Color(utilizationColors.gray.color)
    }
    return color
}

const widget = new ListWidget()
await createWidget()

// used for debugging if script runs inside the app
if (!config.runsInWidget) {
    await widget.presentSmall()
}
Script.setWidget(widget)
Script.complete()

// build the content of the widget
async function createWidget() {

    widget.setPadding(10, 15, 10, 10);
    widget.backgroundColor = new Color("#000");

    const cityIcon = await getImage(boulderweltShortName +'.png');
    const cityImage = widget.addImage(cityIcon);
    widget.addSpacer(4);

    var currentUtilization = await loadUtilization(boulderweltShortName, "current");

    if(!currentUtilization['is_open']) {
        console.log("BW is closed");
        const defaultUpdatedTimeInfo = widget.addText("Updated: " + new Date().toLocaleTimeString("de-DE", timeFormatOptions));
        defaultUpdatedTimeInfo.font = Font.regularSystemFont(8);
        defaultUpdatedTimeInfo.textColor = textColor;
        widget.addSpacer(8);

        const isClosedInfoText = widget.addText("Boulderwelt ist momentan geschlossen");
        isClosedInfoText.font = Font.regularSystemFont(8);
        isClosedInfoText.textColor = textColor;

        return
    } else {
        console.log("BW is open");
        console.log(currentUtilization);
        const lastUpdateTime = new Date(currentUtilization['utilizations']['date_time']);
        console.log(lastUpdateTime)
        const updatedTimeInfo = widget.addText("Updated: " + lastUpdateTime.toLocaleTimeString("de-DE", timeFormatOptions));
        updatedTimeInfo.font = Font.regularSystemFont(8);
        updatedTimeInfo.textColor = textColor;
        widget.addSpacer(6);

        const currentUtilizationValue = currentUtilization['utilizations']['utilization'];
        const currentUtilizationText = widget.addText("Auslastung: " + currentUtilizationValue + "%");
        currentUtilizationText.font = Font.regularSystemFont(14);
        currentUtilizationText.textColor = getUtilizationColor(currentUtilizationValue);

        const currentPeopleWaitingValue = currentUtilization['utilizations']['people_waiting'];
        const currentPeopleWaitingText = widget.addText("Wartende: " + currentPeopleWaitingValue );
        currentPeopleWaitingText.font = Font.regularSystemFont(14);
        currentPeopleWaitingText.textColor = textColor;

        widget.addSpacer(8);

        const graphHeight = 120;
        const graphWidth = 345;

        const drawGraph = new DrawContext();
        drawGraph.size = new Size(graphWidth, graphHeight);

        const background = new Rect(0, 0, graphWidth, graphHeight);
        drawGraph.setFillColor(new Color('#000'));
        drawGraph.fillRect(background);

        const graphBackground = new Path();
        graphBackgroundRect = new Rect(0, 0, graphWidth, graphHeight);
        graphBackground.addRoundedRect(graphBackgroundRect, 10, 10)
        drawGraph.addPath(graphBackground);
        drawGraph.setFillColor(Color.gray())
        drawGraph.fillPath();

        const horizontalLine50 = new Path();
        horizontalLine50.move(new Point(0, 70));
        horizontalLine50.addLine(new Point(graphWidth - 35, 70));
        drawGraph.addPath(horizontalLine50);
        drawGraph.strokePath();

        const horizontalLine100 = new Path();
        horizontalLine100.move(new Point(0, 20));
        horizontalLine100.addLine(new Point(graphWidth - 35, 20));
        drawGraph.addPath(horizontalLine100);
        drawGraph.strokePath();

        drawGraph.setTextColor(Color.black());
        drawGraph.drawText("50", new Point(graphWidth - 30, 60))
        drawGraph.drawText("100", new Point(graphWidth - 30, 10))

        var todayUtilization = await loadUtilization(boulderweltShortName, "today");
        const todayUtilizations = todayUtilization['utilizations']
        for (var i = 0; i < todayUtilizations.length; i++) {
            const utilizationValue = todayUtilizations[i]['utilization'];
            const waitingValue = todayUtilizations[i]['people_waiting'];

            const rect = new Rect(i * 3 + 10, graphHeight - utilizationValue , 2, utilizationValue )
            drawGraph.setFillColor(getUtilizationColor(utilizationValue))
            drawGraph.fillRect(rect)

            if(waitingValue > 0) {
                const rect = new Rect(i * 3 + 10, graphHeight - 100 - waitingValue , 2, waitingValue )
                drawGraph.setFillColor(getUtilizationColor(utilizationValue))
                drawGraph.fillRect(rect)
            }
        }

        const lastweekUtilization = await loadUtilization(boulderweltShortName, "lastweek");
        const lastweekUtilizations = lastweekUtilization['utilizations']
        const lastWeekUtilizationPath = new Path();
        lastWeekUtilizationPath.move(new Point(10, graphHeight));
        for (var i = 0; i < lastweekUtilizations.length; i++) {
            const utilizationValue = lastweekUtilizations[i]['utilization'];
            lastWeekUtilizationPath.addLine(new Point( i * 3 + 10, graphHeight - utilizationValue));
        }

        drawGraph.addPath(lastWeekUtilizationPath);
        drawGraph.strokePath();

        const graphImg = drawGraph.getImage();
        const widgetGraphImage = widget.addImage(graphImg);
    }
}

// get images from local filestore or download them once
async function getImage(image) {
    let fm = FileManager.local()
    let dir = fm.documentsDirectory()
    let path = fm.joinPath(dir, image)
    if (fm.fileExists(path)) {
        return fm.readImage(path)
    } else {
        // download once
        let imageUrl
        switch (image) {
            case 'muc-ost.png':
                imageUrl = "https://raw.githubusercontent.com/froehr/boulderwelt/master/widget/img/muc-ost.png"
                break
            case 'muc-west.png':
                imageUrl = "https://raw.githubusercontent.com/froehr/boulderwelt/master/widget/img/muc-west.png"
                break
            case 'muc-sued.png':
                imageUrl = "https://raw.githubusercontent.com/froehr/boulderwelt/master/widget/img/muc-sued.png"
                break
            case 'reg.png':
                imageUrl = "https://raw.githubusercontent.com/froehr/boulderwelt/master/widget/img/reg.png"
                break
            case 'dor.png':
                imageUrl = "https://raw.githubusercontent.com/froehr/boulderwelt/master/widget/img/dor.png"
                break
            case 'fra.png':
                imageUrl = "https://raw.githubusercontent.com/froehr/boulderwelt/master/widget/img/fra.png"
                break
            case 'test.png':
                imageUrl = "https://raw.githubusercontent.com/froehr/boulderwelt/master/widget/img/fra.png"
                break
            default:
                console.log(`Sorry, couldn't find ${image}.`);
        }
        let iconImage = await loadImage(imageUrl);
        fm.writeImage(path, iconImage);
        return iconImage;
    }
}

// helper function to download an image from a given url
async function loadImage(imgUrl) {
    const req = new Request(imgUrl);
    return await req.loadImage();
}

async function loadUtilization(boulderwelt, when) {
    const url = "https://boulderwelt-api.herokuapp.com/api/boulderworlds/" + boulderwelt + "/utilizations/" + when
    const req = new Request(url);
    return await req.loadJSON();
}
