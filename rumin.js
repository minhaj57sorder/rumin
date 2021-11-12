function Rumin(elm) {
    target = elm.target || "",
    animName = elm.animName || "animName",
    totalDur = elm.duration || "",
    startTime = elm.startTime || "",
    keyframes = elm.keyframes || "",
    easing = elm.easing || "",
    repeat = elm.repeat || "",
    direction = elm.direction || "",
    yoyo = elm.yoyo || direction,
    motionPath = elm.motionPath || "",
    offsetPath = elm.offsetPath || motionPath,
    makeKeyframes = elm.makeKeyframes || "",
    cssTl = [],
    this.add = (x) => cssTl.push(x),
    this.play = () => {
        let p_keyframes = (time, totlTime) => {
            let e = (time / totlTime) * 100;
            return e
        }
        function getDashoffset(e) {
            let tr = document.getElementById(target).getTotalLength()
            return e * (tr / 100);
        }

        function getTotalTIme() {
            // let y = this.cssTl[this.cssTl.length-1].endAt
                return totalDur
        }
        function removeBlankLine(e) {
            let y = e.replace(/(^[ \t]*\n)/gm, "")
                return  y
        }

        function makeCssKeyframes() {
            let getAllKeyframes = ''
            this.cssTl.forEach(e => {
                makeKeyframes = (keyframeAt, totalDur) => {
            let singleKeyframe = `${p_keyframes(keyframeAt, totalDur)}% {
    ${((e.opacity != '') && (e.opacity != undefined)) ? "opacity:" + e.opacity + ";" : ""}
    ${((e.filter != '') && (e.filter != undefined)) ? "filter:" + e.filter + ";" : ""}
    ${((e.top != '') && (e.top != undefined)) ? "top:" + e.top + ";" : ""}
    ${((e.left != '') && (e.left != undefined)) ? "left:" + e.left + ";" : ""}
    ${((e.right != '') && (e.right != undefined)) ? "right:" + e.right + ";" : ""}
    ${((e.bottom != '') && (e.bottom != undefined)) ? "bottom:" + e.bottom + ";" : ""}
    ${((e.easing != '') && (e.easing != undefined)) ? "ease:" + e.easing + ";" : ""}
    ${((e.transform != '') && (e.transform != undefined)) ? "transform:" + e.transform + ";" : ""}
    ${((e.strokeDashoffset != '') && (e.strokeDashoffset != undefined)) ? "stroke-dashoffset:" + getDashoffset(e.strokeDashoffset) + ";" : ""}
    ${((e.strokeDasharray != '') && (e.strokeDasharray != undefined)) ? "stroke-dasharray:" + getDashoffset(e.strokeDasharray) + ";" : ""}
    ${((e.offsetDistance != '') && (e.offsetDistance != undefined)) ? "offset-distance:" + e.offsetDistance + ";" : ""}
}`
                    return singleKeyframe;
                }
                getAllKeyframes += makeKeyframes(e.keyframeAt, getTotalTIme())
            });

            let timelinieDef = `${(target != '') ? target : "id_Name"}{
    animation: ${(animName != '') ? animName : "animName"} ${getTotalTIme()}s ${(easing != '') ? easing : "ease-in-out"} 0s ${(repeat != '') ? repeat : "1"} ${(yoyo != '') ? yoyo : "normal"};
            
    ${((offsetPath != '') && (offsetPath != undefined)) ? "offset-path:path(\"" +offsetPath + "\");" : ""}
}`

        keyframes = `@keyframes ${animName} {
        ${getAllKeyframes}
    }`

        console.log(`${removeBlankLine(timelinieDef)}
${removeBlankLine(getAllKeyframes)}`)
        document.getElementById('animaStyle').innerHTML += `${timelinieDef}
        ${keyframes}`
            }
            makeCssKeyframes()
    }
}
