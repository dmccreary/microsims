// ESLint configuration for p5.js projects
// Compatible with ESLint 9+ flat config format

import globals from "globals";
import js from "@eslint/js";

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "script",
      globals: {
        ...globals.browser,

        // ===== p5.js Core Structure =====
        preload: "readonly",
        setup: "readonly",
        draw: "readonly",
        remove: "readonly",
        disableFriendlyErrors: "writable",
        noLoop: "readonly",
        loop: "readonly",
        isLooping: "readonly",
        push: "readonly",
        pop: "readonly",
        redraw: "readonly",

        // ===== Environment =====
        frameCount: "readonly",
        deltaTime: "readonly",
        focused: "readonly",
        cursor: "readonly",
        noCursor: "readonly",
        displayWidth: "readonly",
        displayHeight: "readonly",
        windowWidth: "readonly",
        windowHeight: "readonly",
        width: "readonly",
        height: "readonly",
        fullscreen: "readonly",
        pixelDensity: "readonly",
        displayDensity: "readonly",
        getURL: "readonly",
        getURLPath: "readonly",
        getURLParams: "readonly",
        frameRate: "readonly",
        setFrameRate: "readonly",
        getTargetFrameRate: "readonly",
        windowResized: "readonly",

        // ===== Canvas & Rendering =====
        createCanvas: "readonly",
        resizeCanvas: "readonly",
        noCanvas: "readonly",
        createGraphics: "readonly",
        createFramebuffer: "readonly",
        blendMode: "readonly",
        drawingContext: "readonly",
        setAttributes: "readonly",
        smooth: "readonly",
        noSmooth: "readonly",
        describe: "readonly",
        describeElement: "readonly",

        // ===== Color =====
        background: "readonly",
        clear: "readonly",
        colorMode: "readonly",
        fill: "readonly",
        noFill: "readonly",
        stroke: "readonly",
        noStroke: "readonly",
        erase: "readonly",
        noErase: "readonly",
        color: "readonly",
        alpha: "readonly",
        blue: "readonly",
        brightness: "readonly",
        green: "readonly",
        hue: "readonly",
        lerpColor: "readonly",
        lightness: "readonly",
        red: "readonly",
        saturation: "readonly",

        // ===== 2D Shapes =====
        arc: "readonly",
        ellipse: "readonly",
        circle: "readonly",
        line: "readonly",
        point: "readonly",
        quad: "readonly",
        rect: "readonly",
        square: "readonly",
        triangle: "readonly",
        beginShape: "readonly",
        endShape: "readonly",
        vertex: "readonly",
        curveVertex: "readonly",
        bezierVertex: "readonly",
        quadraticVertex: "readonly",
        beginContour: "readonly",
        endContour: "readonly",
        normal: "readonly",

        // ===== 3D Primitives =====
        plane: "readonly",
        box: "readonly",
        sphere: "readonly",
        cylinder: "readonly",
        cone: "readonly",
        ellipsoid: "readonly",
        torus: "readonly",

        // ===== 3D Models =====
        loadModel: "readonly",
        model: "readonly",

        // ===== Curves =====
        bezier: "readonly",
        bezierDetail: "readonly",
        bezierPoint: "readonly",
        bezierTangent: "readonly",
        curve: "readonly",
        curveDetail: "readonly",
        curveTightness: "readonly",
        curvePoint: "readonly",
        curveTangent: "readonly",

        // ===== Attributes =====
        ellipseMode: "readonly",
        rectMode: "readonly",
        strokeCap: "readonly",
        strokeJoin: "readonly",
        strokeWeight: "readonly",

        // ===== Transform =====
        applyMatrix: "readonly",
        resetMatrix: "readonly",
        rotate: "readonly",
        rotateX: "readonly",
        rotateY: "readonly",
        rotateZ: "readonly",
        scale: "readonly",
        shearX: "readonly",
        shearY: "readonly",
        translate: "readonly",

        // ===== Math =====
        abs: "readonly",
        ceil: "readonly",
        constrain: "readonly",
        dist: "readonly",
        exp: "readonly",
        floor: "readonly",
        lerp: "readonly",
        log: "readonly",
        mag: "readonly",
        map: "readonly",
        max: "readonly",
        min: "readonly",
        norm: "readonly",
        pow: "readonly",
        round: "readonly",
        sq: "readonly",
        sqrt: "readonly",
        fract: "readonly",
        sin: "readonly",
        cos: "readonly",
        tan: "readonly",
        asin: "readonly",
        acos: "readonly",
        atan: "readonly",
        atan2: "readonly",
        degrees: "readonly",
        radians: "readonly",
        angleMode: "readonly",

        // ===== Noise & Random =====
        noise: "readonly",
        noiseDetail: "readonly",
        noiseSeed: "readonly",
        random: "readonly",
        randomSeed: "readonly",
        randomGaussian: "readonly",

        // ===== Vectors =====
        createVector: "readonly",
        p5: "readonly",

        // ===== Typography =====
        loadFont: "readonly",
        text: "readonly",
        textFont: "readonly",
        textAlign: "readonly",
        textLeading: "readonly",
        textSize: "readonly",
        textStyle: "readonly",
        textWidth: "readonly",
        textAscent: "readonly",
        textDescent: "readonly",
        textWrap: "readonly",

        // ===== Image =====
        createImage: "readonly",
        loadImage: "readonly",
        image: "readonly",
        tint: "readonly",
        noTint: "readonly",
        imageMode: "readonly",
        saveCanvas: "readonly",
        saveGif: "readonly",
        saveFrames: "readonly",

        // ===== Pixels =====
        pixels: "writable",
        blend: "readonly",
        copy: "readonly",
        filter: "readonly",
        get: "readonly",
        loadPixels: "readonly",
        set: "readonly",
        updatePixels: "readonly",

        // ===== IO: Input =====
        loadJSON: "readonly",
        loadStrings: "readonly",
        loadTable: "readonly",
        loadXML: "readonly",
        loadBytes: "readonly",
        httpGet: "readonly",
        httpPost: "readonly",
        httpDo: "readonly",

        // ===== IO: Output =====
        createWriter: "readonly",
        save: "readonly",
        saveJSON: "readonly",
        saveStrings: "readonly",
        saveTable: "readonly",
        print: "readonly",

        // ===== Mouse Events =====
        mouseX: "readonly",
        mouseY: "readonly",
        pmouseX: "readonly",
        pmouseY: "readonly",
        winMouseX: "readonly",
        winMouseY: "readonly",
        pwinMouseX: "readonly",
        pwinMouseY: "readonly",
        mouseButton: "readonly",
        mouseIsPressed: "readonly",
        mouseMoved: "readonly",
        mouseDragged: "readonly",
        mousePressed: "readonly",
        mouseReleased: "readonly",
        mouseClicked: "readonly",
        doubleClicked: "readonly",
        mouseWheel: "readonly",
        requestPointerLock: "readonly",
        exitPointerLock: "readonly",
        movedX: "readonly",
        movedY: "readonly",

        // ===== Keyboard Events =====
        keyIsPressed: "readonly",
        key: "readonly",
        keyCode: "readonly",
        keyPressed: "readonly",
        keyReleased: "readonly",
        keyTyped: "readonly",
        keyIsDown: "readonly",

        // ===== Touch Events =====
        touches: "readonly",
        touchStarted: "readonly",
        touchMoved: "readonly",
        touchEnded: "readonly",

        // ===== Acceleration Events =====
        deviceOrientation: "readonly",
        accelerationX: "readonly",
        accelerationY: "readonly",
        accelerationZ: "readonly",
        pAccelerationX: "readonly",
        pAccelerationY: "readonly",
        pAccelerationZ: "readonly",
        rotationX: "readonly",
        rotationY: "readonly",
        rotationZ: "readonly",
        pRotationX: "readonly",
        pRotationY: "readonly",
        pRotationZ: "readonly",
        turnAxis: "readonly",
        setMoveThreshold: "readonly",
        setShakeThreshold: "readonly",
        deviceMoved: "readonly",
        deviceTurned: "readonly",
        deviceShaken: "readonly",

        // ===== DOM =====
        select: "readonly",
        selectAll: "readonly",
        removeElements: "readonly",
        changed: "readonly",
        input: "readonly",
        createDiv: "readonly",
        createP: "readonly",
        createSpan: "readonly",
        createImg: "readonly",
        createA: "readonly",
        createSlider: "readonly",
        createButton: "readonly",
        createCheckbox: "readonly",
        createSelect: "readonly",
        createRadio: "readonly",
        createColorPicker: "readonly",
        createInput: "readonly",
        createFileInput: "readonly",
        createVideo: "readonly",
        createAudio: "readonly",
        createCapture: "readonly",
        createElement: "readonly",
        VIDEO: "readonly",
        AUDIO: "readonly",

        // ===== Lights =====
        ambientLight: "readonly",
        specularColor: "readonly",
        directionalLight: "readonly",
        pointLight: "readonly",
        lights: "readonly",
        lightFalloff: "readonly",
        spotLight: "readonly",
        noLights: "readonly",

        // ===== Camera =====
        camera: "readonly",
        perspective: "readonly",
        ortho: "readonly",
        frustum: "readonly",
        createCamera: "readonly",
        setCamera: "readonly",
        orbitControl: "readonly",
        debugMode: "readonly",
        noDebugMode: "readonly",

        // ===== Material =====
        loadShader: "readonly",
        createShader: "readonly",
        shader: "readonly",
        resetShader: "readonly",
        texture: "readonly",
        textureMode: "readonly",
        textureWrap: "readonly",
        normalMaterial: "readonly",
        ambientMaterial: "readonly",
        emissiveMaterial: "readonly",
        specularMaterial: "readonly",
        shininess: "readonly",
        metalness: "readonly",

        // ===== Constants =====
        HALF_PI: "readonly",
        PI: "readonly",
        QUARTER_PI: "readonly",
        TAU: "readonly",
        TWO_PI: "readonly",
        DEGREES: "readonly",
        RADIANS: "readonly",

        // Rendering modes
        P2D: "readonly",
        WEBGL: "readonly",
        WEBGL2: "readonly",

        // Shape modes
        CORNER: "readonly",
        CORNERS: "readonly",
        RADIUS: "readonly",
        CENTER: "readonly",

        // Text alignment
        LEFT: "readonly",
        RIGHT: "readonly",
        TOP: "readonly",
        BOTTOM: "readonly",
        BASELINE: "readonly",

        // Stroke caps/joins
        ROUND: "readonly",
        SQUARE: "readonly",
        PROJECT: "readonly",
        MITER: "readonly",
        BEVEL: "readonly",

        // Color modes
        RGB: "readonly",
        HSB: "readonly",
        HSL: "readonly",

        // Shape types
        POINTS: "readonly",
        LINES: "readonly",
        LINE_STRIP: "readonly",
        LINE_LOOP: "readonly",
        TRIANGLES: "readonly",
        TRIANGLE_FAN: "readonly",
        TRIANGLE_STRIP: "readonly",
        QUADS: "readonly",
        QUAD_STRIP: "readonly",
        TESS: "readonly",
        CLOSE: "readonly",

        // Arc modes
        OPEN: "readonly",
        CHORD: "readonly",
        PIE: "readonly",

        // Blend modes
        BLEND: "readonly",
        REMOVE: "readonly",
        ADD: "readonly",
        DARKEST: "readonly",
        LIGHTEST: "readonly",
        DIFFERENCE: "readonly",
        SUBTRACT: "readonly",
        EXCLUSION: "readonly",
        MULTIPLY: "readonly",
        SCREEN: "readonly",
        REPLACE: "readonly",
        OVERLAY: "readonly",
        HARD_LIGHT: "readonly",
        SOFT_LIGHT: "readonly",
        DODGE: "readonly",
        BURN: "readonly",

        // Filter types
        THRESHOLD: "readonly",
        GRAY: "readonly",
        OPAQUE: "readonly",
        INVERT: "readonly",
        POSTERIZE: "readonly",
        DILATE: "readonly",
        ERODE: "readonly",
        BLUR: "readonly",

        // Text styles
        NORMAL: "readonly",
        ITALIC: "readonly",
        BOLD: "readonly",
        BOLDITALIC: "readonly",

        // Texture modes
        IMAGE: "readonly",
        NEAREST: "readonly",
        REPEAT: "readonly",
        CLAMP: "readonly",
        MIRROR: "readonly",

        // Device orientation
        LANDSCAPE: "readonly",
        PORTRAIT: "readonly",

        // WebGL
        GRID: "readonly",
        AXES: "readonly",

        // Keyboard
        BACKSPACE: "readonly",
        DELETE: "readonly",
        ENTER: "readonly",
        RETURN: "readonly",
        TAB: "readonly",
        ESCAPE: "readonly",
        SHIFT: "readonly",
        CONTROL: "readonly",
        OPTION: "readonly",
        ALT: "readonly",
        UP_ARROW: "readonly",
        DOWN_ARROW: "readonly",
        LEFT_ARROW: "readonly",
        RIGHT_ARROW: "readonly",

        // Cursor types
        ARROW: "readonly",
        CROSS: "readonly",
        HAND: "readonly",
        MOVE: "readonly",
        TEXT: "readonly",
        WAIT: "readonly",

        // Text wrap
        WORD: "readonly",
        CHAR: "readonly",

        // Misc
        AUTO: "readonly",
        VERSION: "readonly",
      }
    },
    rules: {
      // Customize rules as needed
      "no-unused-vars": "warn",
      "no-undef": "error",
    }
  }
];
