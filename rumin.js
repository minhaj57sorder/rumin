
var is = {
    arr: function (a) { return Array.isArray(a); },
    obj: function (a) { return stringContains(Object.prototype.toString.call(a), 'Object'); },
    pth: function (a) { return is.obj(a) && a.hasOwnProperty('totalLength'); },
    svg: function (a) { return a instanceof SVGElement; },
    inp: function (a) { return a instanceof HTMLInputElement; },
    dom: function (a) { return a.nodeType || is.svg(a); },
    str: function (a) { return typeof a === 'string'; },
    fnc: function (a) { return typeof a === 'function'; },
    und: function (a) { return typeof a === 'undefined'; },
    nil: function (a) { return is.und(a) || a === null; },
    hex: function (a) { return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(a); },
    rgb: function (a) { return /^rgb/.test(a); },
    hsl: function (a) { return /^hsl/.test(a); },
    col: function (a) { return (is.hex(a) || is.rgb(a) || is.hsl(a)); },
    key: function (a) { return !defaultInstanceSettings.hasOwnProperty(a) && !defaultTweenSettings.hasOwnProperty(a) && a !== 'targets' && a !== 'keyframes'; },
};
function normalizeAndAlignPaths(selectors) {
    function normalizePath(path, totalPoints) {
        const length = path.getTotalLength();
        const step = length / (totalPoints - 1);
        let normalizedPoints = [];

        for (let i = 0; i < totalPoints; i++) {
            const point = path.getPointAtLength(i * step);
            normalizedPoints.push({ x: point.x, y: point.y });
        }

        return normalizedPoints;
    }

    function findClosestIndex(points, referencePoint) {
        let closestIndex = 0;
        let minDistance = Infinity;

        points.forEach((point, index) => {
            const distance = Math.hypot(point.x - referencePoint.x, point.y - referencePoint.y);
            if (distance < minDistance) {
                minDistance = distance;
                closestIndex = index;
            }
        });

        return closestIndex;
    }

    function reorderPath(points, startIndex) {
        return points.slice(startIndex).concat(points.slice(0, startIndex));
    }

    function pointsToPathData(points) {
        return points.map((point, index) => {
            return `${index === 0 ? 'M' : 'L'}${point.x},${point.y}`;
        }).join(' ');
    }

    function normalizeAndAlignPaths(paths) {
        const totalPoints = paths.reduce((max, path) => Math.max(max, path.getTotalLength()), 0);
        const normalizedPaths = paths.map(path => normalizePath(path, totalPoints));

        const referencePoint = normalizedPaths[0][0];

        const alignedPaths = normalizedPaths.map(points => {
            const startIndex = findClosestIndex(points, referencePoint);
            const reorderedPoints = reorderPath(points, startIndex);
            return pointsToPathData(reorderedPoints);
        });

        return alignedPaths;
    }

    // Usage example
    const paths = document.querySelectorAll(`${selectors}`);
    const normalizedAndAlignedPathsOutput = normalizeAndAlignPaths(Array.from(paths));

    // Apply the normalized and aligned paths back to the elements
    normalizedAndAlignedPathsOutput.forEach((d, i) => {
        paths[i].setAttribute('d', d);
    });
}
function replaceWithUnderscores(string) {
    const specialCharsAndWhitespaceRegex = /[\s\W-]+/g;
    return string.replace(specialCharsAndWhitespaceRegex, '_');
}

function generateUniqueId() {
    // A simple counter to ensure uniqueness with each call within a single page session
    let counter = 0;

    return function () {
        const now = Date.now().toString(36);  // Convert timestamp to base-36 for compactness
        const randomPart = Math.random().toString(36).substr(2, 9); // Generate random string
        counter++;  // Increment counter
        return `${now}-${randomPart}-${counter.toString(36)}`;
    }
}

const _AccpetedAnimationProperty = {
    opacity: "opacity",
    color: "color",
    fill: "fill",
    backgroundColor: "background-color",
    "background-color": "background-color",
    filter: "filter",
    top: "top",
    left: "left",
    right: "right",
    bottom: "bottom",
    easing: "easing",
    transform: "transform",
    path: "path",
    draw: "draw",
    strokeDashoffset: "stroke-dashoffset",
    "stroke-dashoffset": "stroke-dashoffset",
    strokeDasharray: "stroke-dasharray",
    "stroke-dasharray": "stroke-dasharray",
    offsetDistance: "offset-distance",
    "offset-distance": "offset-distance",
}

// Create an instance of the ID generator
const getUniqueId = generateUniqueId();

function Rumin(elm) {
    let setedValue = "";
    function getDashoffset(e) {
        // dasharray and dashoffset in percent
        let tr = document.querySelector(target).getTotalLength()
        return e.replace(/%/gm, "") * (tr / 100);
    };
    function drawStroke(e) {
        let trl = document.querySelector(target).getTotalLength()
        // dasharray and dashoffset in percent
        let value = e.split(' ')
        let a = value[0].replace(/%/gm, "") * (trl / 100);
        let c = 1 * (trl - a) + "px"
        let x
        let z = trl
        if (value.length == 2) {
            x = value[1].replace(/%/gm, "") * (trl / 100);
            z = x - a
            c = -1 * a + "px"
        }
        y = `${z}px ${trl + 10}px`
        return [c, y]
    };

    function getPathValues(path) {
        if (is.str(path)) {
            const pathNode = document.querySelector(path)
            if (pathNode && pathNode instanceof SVGPathElement) {
                return pathNode.getAttribute('d').replaceAll("\n", " ")
            } else {
                return path
            }
        }
        else if (is.obj(path)) {
            if (path && path instanceof SVGPathElement) {
                return path.getAttribute('d').replace("\n", " ")
            }
        }
        else {
            return path
        }
    }

    function getCssFormatedProperty(key, value) {
        switch (key) {
            case "stroke-dashoffset":
                return key + ":" + getDashoffset(value) + ";\n";
            case "stroke-dasharray":
                return key + ":" + getDashoffset(value) + ";\n";
            case "offset-distance":
                return key + ":" + value + ";\n";
            case "path":
                return "d:path(\"" + getPathValues(value) + "\");\n";
            case "draw":
                return "stroke-dashoffset:" + drawStroke(value)[0] + ";\n\t\t" + "stroke-dasharray:" + drawStroke(value)[1] + ";\n";
            default:
                return key + ":" + value + ";\n";
        }
    };

    function percent_value_of_keyframes(time, totlTime) {
        let e = (time / totlTime) * 100;
        return e
    };
    function makeKeyframe(cssTlElement, keyframeAt, totalDur) {
        // start keyframe identifier with keyframe value
        let singleKeyframe = percent_value_of_keyframes(keyframeAt, totalDur) + "%{\n"
        // get list of input css property keys for animation
        const cssElementKeys = Object.keys(cssTlElement)
        // get length of input css property for animation
        const lengthOfCssElement = cssElementKeys.length
        for (let i = 0; i < lengthOfCssElement; i++) {
            // current key for current index based on array value
            const cssElementKey = cssElementKeys[i]
            // check is it valid for this animation
            if (Object.hasOwnProperty.call(cssTlElement, cssElementKey) && Object.hasOwnProperty.call(_AccpetedAnimationProperty, cssElementKey)) {
                // css value
                const element = cssTlElement[cssElementKey];
                // if css value found then get css property formatted for each keyframe
                if ((element != '') && (element != undefined)) {
                    singleKeyframe += "\n\t\t" + getCssFormatedProperty(_AccpetedAnimationProperty[cssElementKey], element) + "\n"
                }
            }
        }
        // finally close keyframe identifire
        singleKeyframe += "\t}"
        // finally return single keyframe
        return singleKeyframe;
    }

    target = elm.target || "",
        animName = elm.animName || `${elm.target}_${getUniqueId()}`,
        totalDur = elm.duration || "",
        startTime = elm.startTime || "",
        keyframes = elm.keyframes || "",
        easing = elm.easing || "",
        delay = elm.delay || "0s",
        timeScale = elm.timeScale || 1,
        repeat = elm.repeat || "",
        repeatDelay = elm.repeatDelay || 0,
        direction = elm.direction || elm.yoyo || "",
        motionPath = elm.motionPath || "",
        offsetPath = elm.offsetPath || motionPath,
        cssTl = [],
        this.set = (elms, vals) => {
            elms = document.querySelectorAll(elms)
            Object.keys(vals).forEach(key => {
                for (let i = 0; i < elms.length; i++) {
                    let p = key
                    var pN = p.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
                    if ((pN == "stroke-dasharray") || (pN == "stroke-dashoffset")) {
                        // dasharray and dashoffset in percent
                        elms[i].style.setProperty(pN, getDashoffset((vals[key])))
                    } else {
                        elms[i].style.setProperty(pN, vals[key])
                    }
                    setedValue += pN + ":" + vals[key] + ";"
                }
            });
            // console.log(setedValue)
            return this
        },
        this.add = (x) => {
            cssTl.push(x)
            return this
        },
        this.play = () => {
            // copy to clip board
            const button = document.createElement('button');
            button.innerText = 'Copy Css To Clipboard';
            button.style.position = 'fixed';
            button.style.left = '50%';
            button.style.bottom = '25px';
            button.style.backgroundColor = 'white';
            button.style.color = 'black';
            button.style.padding = '5px 10px';
            button.style.borderRadius = '5px';
            button.style.transform = 'translate(-50%, -50%)';
            document.body.appendChild(button);
            button.addEventListener('click', function () {
                button.innerText = 'Copied';
                navigator.clipboard.writeText(document.getElementById("ruminStyle").innerHTML)
                setTimeout(() => {
                    button.innerText = 'Copy Css To Clipboard';
                }, 1000)
            })
            // start playing animation


            function getTotalTIme() {
                // console.log(this.cssTl)
                return this.cssTl.reduce((a, c) => a + c.duration, 0)
            }
            function getKeyframeAt(currentIndex) {
                if (!(currentIndex < this.cssTl.length)) {
                    return 0;
                }
                let keyframeAt = 0;
                for (let i = 0; i <= currentIndex; i++) {
                    keyframeAt += this.cssTl[i].duration
                }
                return keyframeAt;
            }
            function transformArray(initialArray) {
                const finalArray = [];
                let previousElements = {};

                initialArray.forEach((obj, index) => {
                    // If object has no duration, set duration to 1
                    if (!('duration' in obj)) {
                        obj.duration = 1;
                    }

                    // Create a new object with properties from previousElements, but updated delay with duration
                    if ('delay' in obj) {
                        const newObj = { ...previousElements };
                        newObj.duration = obj.delay;
                        finalArray.push(newObj);

                        // Remove delay from the current object
                        delete obj.delay;
                    }

                    // Update previousElements to include current object's properties
                    previousElements = { ...previousElements, ...obj };

                    // Push the current object to the final array
                    finalArray.push({ ...obj });
                });
                return finalArray;
            }
            function removeBlankLine(e) {
                let y = e.replace(/(^[ \t]*\n)/gm, "")
                return y
            }

            function makeCssKeyframes() {
                this.cssTl = transformArray(this.cssTl)
                if (!totalDur) {
                    totalDur = this.cssTl[this.cssTl.length - 1].duration
                    // console.log("duration not found: ", totalDur)
                }
                // add starting keyframe duration to adjust css keyframe
                if (this.cssTl[0].duration !== 0) {
                    this.cssTl.unshift({
                        ...this.cssTl[0],
                        duration: 0
                    })
                }
                // add delay at after animation done, effective for repeat animation
                if (repeatDelay && repeatDelay > 0) {
                    this.cssTl.push({
                        ...this.cssTl[this.cssTl.length - 1],
                        duration: repeatDelay
                    })
                }
                // console.log(this.cssTl)

                // if morph animation then normalize path
                const isMorphExist = this.cssTl.some(e => e.hasOwnProperty('path'))
                if (isMorphExist) {
                    const selectors = this.cssTl.map(e => {
                        if(e.hasOwnProperty('path')){
                            return e.path
                        }else{
                            return ""
                        }
                    }).join(", ")
                    normalizeAndAlignPaths(selectors)
                }
                let keyframesList = ''
                this.cssTl.forEach((cssTlElement, indexOfcssTl) => {
                    keyframesList += "\n\t" + makeKeyframe(cssTlElement, getKeyframeAt(indexOfcssTl), getTotalTIme())

                });

                let timelinieDef = (target != '') ? target : "id_Name";
                timelinieDef += "{\n\t" + setedValue + "\n"
                timelinieDef += `\tanimation: ${(animName != '') ? replaceWithUnderscores(animName) : "animName"} ${getTotalTIme() * timeScale}s ${(easing != '') ? easing : "ease-in-out"}  ${(delay != '') ? delay : "0s"} ${(repeat == -1) ? 'infinite' : repeat != "" ? repeat : "1"} ${(direction != '') ? direction : "normal"};\n`
                timelinieDef += `${((offsetPath != '') && (offsetPath != undefined)) ? "offset-path:path(\"" + offsetPath + "\");" : ""}}\n`

                let keyframes = "@keyframes " + replaceWithUnderscores(animName) + "{\n"
                keyframes += " \t" + keyframesList + "\n"
                keyframes += "}\n"

                let ruminStyle = document.getElementById("ruminStyle");
                if (!ruminStyle) {
                    ruminStyle = document.createElement("style")
                    ruminStyle.id = "ruminStyle"
                    document.head.appendChild(ruminStyle)
                }
                let innerData = removeBlankLine(timelinieDef)
                innerData += removeBlankLine(keyframes)
                document.getElementById('ruminStyle').innerHTML += innerData
            }
            makeCssKeyframes()
        }
}
// TODO: stagger animation
// Rumin.prototype.set=(elms,vals)=>{
//     let a=""
//     elms = document.querySelectorAll(elms)
//     Object.keys(vals).forEach(key => {
//         for(let i=0; i < elms.length; i++){
//             let p = key
//             var pN = p.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
//             if((pN=="stroke-dasharray")||(pN=="stroke-dashoffset")){
//                 elms[i].style.setProperty(pN,getDashoffset((vals[key])))
//             }else{
//                 elms[i].style.setProperty(pN,vals[key])
//             }
//             a+=pN+":"+vals[key]+";"
//         }
//     });
//     console.log(a)
//     return a
// }
// example code
// let myAnim2 = new Rumin({
//     target:"#box2",
//     animName:"myidanim",
//     easing:"ease-in-out",
//     direction: 'forwards',
//     repeat:"infinite",
//     repeatDelay: 1,
// })
// myAnim2.set(".st5",{strokeWidth:"20px",stroke:"blue"})
// myAnim2.set(".st8",{fill:"none",strokeWidth:"20px",stroke:"red"})
// .add({ duration: 0, draw: "0% 20%", transform: "translate(0px, 0px)" })
// .add({ duration: 0.2, transform: "translate(30px, 40px)" })
// .add({ delay: 1, draw: "50% 60%" })
// .add({ delay: 0.5, draw: "100% 100%", transform: "translate(20px, 80px)" })
// .add({ duration: 0, path: "#circle" })
// .add({ duration: 1, path: "#hippo" })
// .add({ duration: 1, path: "#circle" })
// .play()

