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
        direction = elm.direction || "",
        yoyo = elm.yoyo || direction,
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
                return totalDur
            }
            function removeBlankLine(e) {
                let y = e.replace(/(^[ \t]*\n)/gm, "")
                return y
            }

            function makeCssKeyframes() {
                let getAllKeyframes = ''
                this.cssTl.forEach(e => {
                    makeKeyframes = (keyframeAt, totalDur) => {
                        let singleKeyframe = `${p_keyframes(keyframeAt, totalDur)}% {
    ${((e.opacity != '') && (e.opacity != undefined)) ? "opacity:" + e.opacity + ";" : ""}
    ${((e.color != '') && (e.color != undefined)) ? "color:" + e.color + ";" : ""}
    ${((e.fill != '') && (e.fill != undefined)) ? "fill:" + e.fill + ";" : ""}
    ${((e.backgroundColor != '') && (e.backgroundColor!= undefined)) ? "background-color:" + e.backgroundColor + ";" : ""}
    ${((e.filter != '') && (e.filter != undefined)) ? "filter:" + e.filter + ";" : ""}
    ${((e.top != '') && (e.top != undefined)) ? "top:" + e.top + ";" : ""}
    ${((e.left != '') && (e.left != undefined)) ? "left:" + e.left + ";" : ""}
    ${((e.right != '') && (e.right != undefined)) ? "right:" + e.right + ";" : ""}
    ${((e.bottom != '') && (e.bottom != undefined)) ? "bottom:" + e.bottom + ";" : ""}
    ${((e.easing != '') && (e.easing != undefined)) ? "ease:" + e.easing + ";" : ""}
    ${((e.transform != '') && (e.transform != undefined)) ? "transform:" + e.transform + ";" : ""}
    ${((e.path != '') && (e.path != undefined)) ? "d:path(\"" + e.path + "\");" : ""}
    ${((e.draw != '') && (e.draw != undefined)) ? "stroke-dashoffset:" + drawStroke(e.draw)[0] + ";" + "stroke-dasharray:" + drawStroke(e.draw)[1] + ";" : ""}
    ${((e.strokeDashoffset != '') && (e.strokeDashoffset != undefined)) ? "stroke-dashoffset:" + getDashoffset(e.strokeDashoffset) + ";" : ""}
    ${((e.strokeDasharray != '') && (e.strokeDasharray != undefined)) ? "stroke-dasharray:" + getDashoffset(e.strokeDasharray) + ";" : ""}
    ${((e.offsetDistance != '') && (e.offsetDistance != undefined)) ? "offset-distance:" + e.offsetDistance + ";" : ""}
}`
                        return singleKeyframe;
                    }
                    getAllKeyframes += makeKeyframes(e.keyframeAt, getTotalTIme())
                });

                let timelinieDef = `${(target != '') ? target : "id_Name"}{
    ${setedValue}
    animation: ${(animName != '') ? replaceWithUnderscores(animName) : "animName"} ${getTotalTIme() * timeScale}s ${(easing != '') ? easing : "ease-in-out"}  ${(delay != '') ? delay : "0s"}  ${(repeat != '') ? repeat : "1"} ${(yoyo != '') ? yoyo : "normal"};
            
    ${((offsetPath != '') && (offsetPath != undefined)) ? "offset-path:path(\"" + offsetPath + "\");" : ""}
}`

                keyframes = `@keyframes ${replaceWithUnderscores(animName)} {
        ${getAllKeyframes}
    }`

                console.log(`${removeBlankLine(timelinieDef)}
${removeBlankLine(keyframes)}`)

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
//     duration:6,
//     easing:"ease-in-out",
//     repeat:"infinite"
// })
// myAnim2.set(".st5",{strokeWidth:"20px",stroke:"blue"})
// myAnim2.set(".st8",{fill:"none",strokeWidth:"20px",stroke:"red"})
// myAnim2.add({
//     keyframeAt:0,
//     transform:"translateX(0px)",
//     opacity:1
// })
// myAnim2.add({
//     keyframeAt:3,
//     transform:"translateX(250px)",
//     opacity:0.5
// })
// myAnim2.add({
//     keyframeAt:6,
//     transform:"translateX(0px)",
//     opacity:1,
//     offsetDistance:"10%"
// })
// myAnim2.play()
