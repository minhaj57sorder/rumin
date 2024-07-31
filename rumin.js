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
        makeKeyframes = elm.makeKeyframes || "",
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
            button.style.transform = 'translate(-50%, -50%)';
            document.body.appendChild(button);
            button.addEventListener('click', function () {
                navigator.clipboard.writeText(document.getElementById("ruminStyle").innerHTML)
            })
            // start playing animation
            let p_keyframes = (time, totlTime) => {
                let e = (time / totlTime) * 100;
                return e
            }

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
                if (this.cssTl[0].duration !== 0) {
                    this.cssTl.unshift({
                        ...this.cssTl[0],
                        duration: 0
                    })
                }
                if(repeatDelay && repeatDelay > 0){
                    this.cssTl.push({
                        ...this.cssTl[this.cssTl.length - 1],
                        duration: repeatDelay
                    })
                }
                console.log(this.cssTl)

                let getAllKeyframes = ''
                this.cssTl.forEach((cssTlElement, indexOfcssTl) => {
                    let makeKeyframes = (keyframeAt, totalDur) => {
                        let singleKeyframe = `${p_keyframes(keyframeAt, totalDur)}% {
    ${((cssTlElement.opacity != '') && (cssTlElement.opacity != undefined)) ? "opacity:" + cssTlElement.opacity + ";" : ""}
    ${((cssTlElement.color != '') && (cssTlElement.color != undefined)) ? "color:" + cssTlElement.color + ";" : ""}
    ${((cssTlElement.fill != '') && (cssTlElement.fill != undefined)) ? "fill:" + cssTlElement.fill + ";" : ""}
    ${((cssTlElement.backgroundColor != '') && (cssTlElement.backgroundColor != undefined)) ? "background-color:" + cssTlElement.backgroundColor + ";" : ""}
    ${((cssTlElement.filter != '') && (cssTlElement.filter != undefined)) ? "filter:" + cssTlElement.filter + ";" : ""}
    ${((cssTlElement.top != '') && (cssTlElement.top != undefined)) ? "top:" + cssTlElement.top + ";" : ""}
    ${((cssTlElement.left != '') && (cssTlElement.left != undefined)) ? "left:" + cssTlElement.left + ";" : ""}
    ${((cssTlElement.right != '') && (cssTlElement.right != undefined)) ? "right:" + cssTlElement.right + ";" : ""}
    ${((cssTlElement.bottom != '') && (cssTlElement.bottom != undefined)) ? "bottom:" + cssTlElement.bottom + ";" : ""}
    ${((cssTlElement.easing != '') && (cssTlElement.easing != undefined)) ? "ease:" + cssTlElement.easing + ";" : ""}
    ${((cssTlElement.transform != '') && (cssTlElement.transform != undefined)) ? "transform:" + cssTlElement.transform + ";" : ""}
    ${((cssTlElement.path != '') && (cssTlElement.path != undefined)) ? "d:path(\"" + cssTlElement.path + "\");" : ""}
    ${((cssTlElement.draw != '') && (cssTlElement.draw != undefined)) ? "stroke-dashoffset:" + drawStroke(cssTlElement.draw)[0] + ";" + "stroke-dasharray:" + drawStroke(cssTlElement.draw)[1] + ";" : ""}
    ${((cssTlElement.strokeDashoffset != '') && (cssTlElement.strokeDashoffset != undefined)) ? "stroke-dashoffset:" + getDashoffset(cssTlElement.strokeDashoffset) + ";" : ""}
    ${((cssTlElement.strokeDasharray != '') && (cssTlElement.strokeDasharray != undefined)) ? "stroke-dasharray:" + getDashoffset(cssTlElement.strokeDasharray) + ";" : ""}
    ${((cssTlElement.offsetDistance != '') && (cssTlElement.offsetDistance != undefined)) ? "offset-distance:" + cssTlElement.offsetDistance + ";" : ""}
}`
                        return singleKeyframe;
                    }
                    getAllKeyframes += makeKeyframes(getKeyframeAt(indexOfcssTl), getTotalTIme())
                });

                let timelinieDef = `${(target != '') ? target : "id_Name"}{
    ${setedValue}
    animation: ${(animName != '') ? replaceWithUnderscores(animName) : "animName"} ${getTotalTIme() * timeScale}s ${(easing != '') ? easing : "ease-in-out"}  ${(delay != '') ? delay : "0s"} ${(repeat == -1) ? 'infinite' : repeat != "" ? repeat : "1"} ${(direction != '') ? direction : "normal"};
            
    ${((offsetPath != '') && (offsetPath != undefined)) ? "offset-path:path(\"" + offsetPath + "\");" : ""}
}`

                let keyframes = `@keyframes ${replaceWithUnderscores(animName)} {
        ${getAllKeyframes}
    }`

                //                 console.log(`${removeBlankLine(timelinieDef)}
                // ${removeBlankLine(keyframes)}`)

                let ruminStyle = document.getElementById("ruminStyle");
                if (!ruminStyle) {
                    ruminStyle = document.createElement("style")
                    ruminStyle.id = "ruminStyle"
                    document.head.appendChild(ruminStyle)
                }

                document.getElementById('ruminStyle').innerHTML += `${removeBlankLine(timelinieDef)}
        ${removeBlankLine(keyframes)}`
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
// .play()
