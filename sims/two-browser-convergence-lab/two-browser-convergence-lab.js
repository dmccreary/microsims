// Two-Browser Convergence Lab - p5.js
// CANVAS_HEIGHT: 660
// Learning objective (Analyze / compare): the learner compares a last-writer-wins merge
// with an append-only event-set merge by running the Chromebook and laptop scenario
// (Chapter 23) and identifying which attempts each approach loses.
// Scenario: Monday morning the Chromebook (c7) records 3 answers (2 right) but Wi-Fi drops
// before it syncs. That evening the laptop (f2) records 4 answers (all right) and syncs.
// Tuesday the Chromebook reconnects and syncs.
// Merge rules modelled:
//   Event set (union): each device seals its answers into an immutable segment, pushes
//     segments it has not uploaded, then pulls every other device's segments past its
//     version vector. Merge = set union by statement id, sorted by HLC.
//   Last writer wins: each device keeps a whole-record snapshot stamped with its newest
//     HLC. Sync pushes the snapshot only if it is newer than the one in S3, then pulls the
//     S3 snapshot if that is newer, replacing the local record wholesale.
// HLC values are illustrative, chosen so the laptop's answers sort after the Chromebook's.
// Layout: fixed canvas height; the control rows wrap on narrow screens and the drawing
// region takes the rest. Columns stack vertically below 500px.

// ---------- canvas and layout ----------
let canvasWidth = 700;
let canvasHeight = 660;          // fixed: equals CANVAS_HEIGHT
let controlHeight = 120;         // recomputed by layoutControls()
let drawHeight = canvasHeight - controlHeight;
let margin = 10;
let defaultTextSize = 16;

// ---------- scenario data (illustrative ids and HLC values) ----------
const CB_ANSWERS = [
    { id: '3f2a9c1e-5b7d-4e21-9a0c-1d2e3f4a5b6c', hlc: '1000200-0', ok: true },
    { id: '8b41d7f0-2c3e-4f5a-8b6c-7d8e9f0a1b2c', hlc: '1000230-0', ok: false },
    { id: 'c9e05a36-4d5e-4f60-9a1b-2c3d4e5f6a7b', hlc: '1000260-0', ok: true }
];
const LAP_ANSWERS = [
    { id: 'e1a27b94-6f80-4a1b-8c2d-3e4f5a6b7c8d', hlc: '1036000-0', ok: true },
    { id: '5d6c8e2a-7a91-4b2c-9d3e-4f5a6b7c8d9e', hlc: '1036030-0', ok: true },
    { id: 'a0b1c2d3-8ba2-4c3d-8e4f-5a6b7c8d9e0f', hlc: '1036060-0', ok: true },
    { id: '7f8e9d0c-9cb3-4d4e-9f50-6b7c8d9e0f1a', hlc: '1036090-0', ok: true }
];
const TOTAL_ATTEMPTS = 7;

// ---------- controls ----------
let cbAnswerBtn, lapAnswerBtn, offlineBox, syncCbBtn, syncLapBtn, ruleRadio, resetBtn;
let controlLabels = [];

// ---------- state ----------
let rule = 'union';
let devices, s3, job, changeStamp, note, hitBoxes;

function freshDevice(id, name) {
    return { id, name, events: [], segments: [], vv: { c7: 0, f2: 0 },
             discarded: [], answered: false, lastSyncStamp: -1, syncs: 0 };
}

function resetState(msg) {
    devices = { c7: freshDevice('c7', 'Chromebook (c7)'), f2: freshDevice('f2', 'Home laptop (f2)') };
    s3 = { segments: [], record: null };
    job = null;
    changeStamp = 0;
    note = msg || 'Monday morning: answer on the Chromebook, then tick “Chromebook offline” because the Wi-Fi drops.';
}

function setup() {
    updateCanvasSize();
    const canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent(document.querySelector('main'));
    textSize(defaultTextSize);
    const main = document.querySelector('main');

    cbAnswerBtn = createButton('Chromebook: answer 3 (2 right)');
    cbAnswerBtn.mousePressed(() => answer('c7'));
    lapAnswerBtn = createButton('Laptop: answer 4 (4 right)');
    lapAnswerBtn.mousePressed(() => answer('f2'));
    offlineBox = createCheckbox('Chromebook offline', false);
    offlineBox.changed(offlineChanged);
    syncCbBtn = createButton('Sync Chromebook');
    syncCbBtn.mousePressed(() => startSync('c7'));
    syncLapBtn = createButton('Sync laptop');
    syncLapBtn.mousePressed(() => startSync('f2'));
    ruleRadio = createRadio('merge-rule');
    ruleRadio.option('union', 'Event set (union)');
    ruleRadio.option('lww', 'Last writer wins');
    ruleRadio.selected('union');
    ruleRadio.style('white-space', 'nowrap');
    ruleRadio.changed(changeRule);
    resetBtn = createButton('Reset');
    resetBtn.mousePressed(() => { resetState(); updateButtons(); });

    [cbAnswerBtn, lapAnswerBtn, offlineBox, syncCbBtn, syncLapBtn, ruleRadio, resetBtn].forEach(c => {
        c.parent(main);
        c.style('font-size', '15px');
    });
    resetState();
    layoutControls();
    updateButtons();
    describe('Two-Browser Convergence Lab. Three columns show a Chromebook, the S3 student ' +
        'prefix and a home laptop. Answer buttons add answer tiles to one device, sync ' +
        'buttons push and then pull, and a merge rule selects last writer wins or an ' +
        'event-set union. Each device shows how many of the seven attempts it counts, and a ' +
        'banner reports whether the two devices agree and which attempts were lost.');
}

// ---------- control layout ----------
function layoutControls() {
    const narrow = canvasWidth < 500;
    const rowH = 34, gap = 8, x0 = margin, right = canvasWidth - margin;
    const all = [cbAnswerBtn, lapAnswerBtn, offlineBox, syncCbBtn, syncLapBtn, ruleRadio, resetBtn];
    all.forEach(c => { c.style('font-size', narrow ? '14px' : '15px'); c.position(0, drawHeight); });
    const groups = [
        [{ el: cbAnswerBtn }, { el: lapAnswerBtn }, { el: offlineBox }],
        [{ el: syncCbBtn }, { el: syncLapBtn }, { label: 'rule', lw: narrow ? 42 : 90, el: ruleRadio }, { el: resetBtn }]
    ];
    const placements = [];
    let row = -1;
    groups.forEach(items => {
        row++;
        let x = x0;
        items.forEach(it => {
            const w = it.w || ((it.lw || 0) + (it.el ? it.el.elt.offsetWidth : 80));
            if (x > x0 && x + w > right) { row++; x = x0; }
            placements.push({ it, x, row });
            x += w + gap;
        });
    });
    controlHeight = (row + 1) * rowH + 12;
    drawHeight = canvasHeight - controlHeight;
    controlLabels = [];
    placements.forEach(p => {
        const y = drawHeight + 8 + p.row * rowH;
        if (p.it.label) controlLabels.push({ key: p.it.label, x: p.x, y: y + 12 });
        if (p.it.el) p.it.el.position(p.x + (p.it.lw || 0), y + ((p.it.el === ruleRadio || p.it.el === offlineBox) ? 3 : 0));
    });
}

function updateButtons() {
    const busy = job !== null;
    setDisabled(cbAnswerBtn, busy || devices.c7.answered);
    setDisabled(lapAnswerBtn, busy || devices.f2.answered);
    setDisabled(syncCbBtn, busy || offlineBox.checked());
    setDisabled(syncLapBtn, busy);
    syncCbBtn.html(offlineBox.checked() ? 'Sync Chromebook (offline)' : 'Sync Chromebook');
}

function setDisabled(el, d) {
    if (d) el.attribute('disabled', ''); else el.removeAttribute('disabled');
}

// ---------- model ----------
function hlcCmp(a, b) {
    if (a === b) return 0;
    if (a === null) return -1;
    if (b === null) return 1;
    const [ta, ca] = a.split('-').map(Number), [tb, cb] = b.split('-').map(Number);
    return ta !== tb ? ta - tb : ca - cb;
}
function sortByHlc(list) { return list.slice().sort((a, b) => hlcCmp(a.hlc, b.hlc)); }
function lastWrite(dev) {
    return dev.events.reduce((m, e) => (hlcCmp(e.hlc, m) > 0 ? e.hlc : m), null);
}

function answer(devId) {
    const dev = devices[devId];
    if (dev.answered) return;
    const src = devId === 'c7' ? CB_ANSWERS : LAP_ANSWERS;
    const seq = dev.segments.length + 1;
    const evs = src.map(a => Object.assign({ device_id: devId, seq }, a));
    dev.events = sortByHlc(dev.events.concat(evs));
    dev.segments.push({ device_id: devId, seq, events: evs, uploaded: false });
    dev.vv[devId] = seq;
    dev.answered = true;
    changeStamp++;
    if (devId === 'c7') {
        note = offlineBox.checked()
            ? 'Monday evening: answer on the laptop, then sync the laptop.'
            : 'Tick “Chromebook offline” to follow the scenario (the Wi-Fi drops before it syncs).';
    } else {
        note = 'Sync the laptop. Then, on Tuesday, untick “Chromebook offline” and sync the Chromebook.';
    }
    updateButtons();
}

// A sync is animated in two phases: push (device -> S3), then pull (S3 -> device)
function startSync(devId) {
    if (job) return;
    job = { dev: devId, phase: 'push', t0: millis(), items: planPush(devId), msgs: [] };
    updateButtons();
}

function planPush(devId) {
    const dev = devices[devId];
    if (rule === 'union') {
        return dev.segments.filter(s => !s.uploaded)
            .map(s => ({ label: devId + '/seg/' + s.seq, seg: s }));
    }
    const lw = lastWrite(dev);
    const remote = s3.record;
    if (dev.events.length && (!remote || hlcCmp(lw, remote.lastWrite) > 0)) {
        return [{ label: 'record.json (' + dev.events.length + ')', snapshot: true }];
    }
    return [];
}

function planPull(devId) {
    const dev = devices[devId];
    if (rule === 'union') {
        const items = [];
        s3.segments.forEach(s => {
            if (s.device_id !== devId && s.seq > dev.vv[s.device_id]) items.push({ label: s.device_id + '/seg/' + s.seq, seg: s });
        });
        return items;
    }
    const remote = s3.record;
    if (remote && hlcCmp(remote.lastWrite, lastWrite(dev)) > 0) {
        return [{ label: 'record.json (' + remote.events.length + ')', snapshot: true }];
    }
    return [];
}

function applyPush(devId, items) {
    const dev = devices[devId];
    if (!items.length) return (rule === 'union' ? 'nothing to push' : 'push skipped (the S3 snapshot is as new or newer)');
    if (rule === 'union') {
        items.forEach(it => { it.seg.uploaded = true; s3.segments.push(it.seg); });
        return 'pushed ' + items.map(i => i.label).join(', ');
    }
    const before = s3.record ? s3.record.events : [];
    s3.record = { events: dev.events.slice(), writer: devId, lastWrite: lastWrite(dev) };
    const overwritten = before.filter(e => !dev.events.some(d => d.id === e.id));
    return 'pushed record.json' + (overwritten.length ? ', overwriting ' + overwritten.length + ' attempt(s) in S3' : '');
}

function applyPull(devId, items) {
    const dev = devices[devId];
    if (!items.length) return 'nothing to pull';
    if (rule === 'union') {
        items.forEach(it => {
            it.seg.events.forEach(e => { if (!dev.events.some(d => d.id === e.id)) dev.events.push(e); });
            dev.vv[it.seg.device_id] = max(dev.vv[it.seg.device_id], it.seg.seq);
        });
        dev.events = sortByHlc(dev.events);
        return 'pulled ' + items.map(i => i.label).join(', ') + ' (set union)';
    }
    const remote = s3.record;
    const lost = dev.events.filter(e => !remote.events.some(r => r.id === e.id));
    dev.discarded = dev.discarded.concat(lost);
    dev.events = remote.events.slice();
    return 'pulled record.json, replacing the local record' + (lost.length ? ' and discarding ' + lost.length + ' attempt(s)' : '');
}

function advanceJob() {
    if (!job) return;
    const dur = job.items.length ? 800 : 350;
    if (millis() - job.t0 < dur) return;
    if (job.phase === 'push') {
        job.msgs.push(applyPush(job.dev, job.items));
        job.phase = 'pull';
        job.items = planPull(job.dev);
        job.t0 = millis();
    } else {
        job.msgs.push(applyPull(job.dev, job.items));
        const dev = devices[job.dev];
        dev.syncs++;
        dev.lastSyncStamp = changeStamp;
        dev.lastMsgs = job.msgs.slice();
        const who = job.dev === 'c7' ? 'Chromebook' : 'Laptop';
        job = null;
        note = who + ' sync: ' + dev_msgs(dev) + ' ' + nextHint();
        updateButtons();
    }
}

function dev_msgs(dev) { return (dev.lastMsgs || []).join('; ') + '.'; }

// Suggest the next step of the Monday/Tuesday scenario
function nextHint() {
    const a = devices.c7, b = devices.f2;
    if (!a.answered) return 'Next: answer on the Chromebook.';
    if (!b.answered) return 'Next: answer on the laptop and sync the laptop.';
    if (a.lastSyncStamp !== changeStamp) {
        return offlineBox.checked() ? 'Next (Tuesday): untick \u201cChromebook offline\u201d and sync the Chromebook.'
                                    : 'Next: sync the Chromebook.';
    }
    if (b.lastSyncStamp !== changeStamp) return 'Next: sync the laptop.';
    const ids = d => d.events.map(e => e.id).sort().join(',');
    if (ids(a) !== ids(b)) return 'The devices still differ: sync the other device again.';
    return '';
}

function offlineChanged() {
    updateButtons();
    if (!job) note = offlineBox.checked() ? 'The Chromebook is offline: its Sync button is blocked.'
                                           : 'The Chromebook is back online. ' + nextHint();
}

function changeRule() {
    rule = ruleRadio.value();
    resetState('Merge rule is now ' + (rule === 'union' ? 'event set (union)' : 'last writer wins') +
               '. The lab was reset so you can run the same scenario again.');
    updateButtons();
}

// ---------- drawing ----------
function draw() {
    updateCanvasSize();
    advanceJob();
    hitBoxes = [];
    stroke('silver');
    strokeWeight(1);
    fill('aliceblue');
    rect(0, 0, canvasWidth, drawHeight);
    fill('white');
    rect(0, drawHeight, canvasWidth, controlHeight);

    noStroke();
    fill('black');
    textAlign(CENTER, TOP);
    textStyle(BOLD);
    textSize(canvasWidth < 500 ? 18 : 21);
    text('Two-Browser Convergence Lab', canvasWidth / 2, 6);
    textStyle(NORMAL);

    // guide / last action
    textSize(14);
    fill('#333');
    const nLines = wrapLines(note, canvasWidth - 2 * margin);
    textAlign(LEFT, TOP);
    const maxNote = canvasWidth < 500 ? 3 : 2;
    nLines.slice(0, maxNote).forEach((ln, i) => text(ln, margin, 32 + i * 17));
    const top = 32 + min(maxNote, nLines.length) * 17 + 6;

    const bannerH = canvasWidth < 500 ? 64 : 48;
    const R = regions(top, drawHeight - bannerH - 10);
    drawDevice(devices.c7, R.c7, R.stacked);
    drawS3(R.s3, R.stacked);
    drawDevice(devices.f2, R.f2, R.stacked);
    drawPackets(R);
    drawBanner(margin, drawHeight - bannerH - 4, canvasWidth - 2 * margin, bannerH);
    drawControlLabels();
    drawTooltip();
}

function regions(top, bottom) {
    const gap = 8;
    if (canvasWidth >= 500) {
        const w = (canvasWidth - 2 * margin - 2 * gap) / 3;
        const h = bottom - top;
        return { stacked: false,
                 c7: { x: margin, y: top, w, h },
                 s3: { x: margin + w + gap, y: top, w, h },
                 f2: { x: margin + 2 * (w + gap), y: top, w, h } };
    }
    const w = canvasWidth - 2 * margin;
    const total = bottom - top - 2 * gap;
    // S3 shows one line per segment when stacked, so give it only the height it needs
    const hs3 = 32 + (rule === 'union' ? max(1, s3.segments.length) * 25 : 40);
    const hd = (total - hs3) / 2;
    return { stacked: true,
             c7: { x: margin, y: top, w, h: hd },
             s3: { x: margin, y: top + hd + gap, w, h: hs3 },
             f2: { x: margin, y: top + hd + hs3 + 2 * gap, w, h: hd } };
}

function panel(r, fillColor, edge) {
    stroke(edge || 'silver');
    fill(fillColor || 'white');
    rect(r.x, r.y, r.w, r.h, 8);
}

function drawDevice(dev, r, stacked) {
    panel(r);
    noStroke();
    fill('black');
    textAlign(LEFT, TOP);
    textSize(15);
    textStyle(BOLD);
    text(dev.name, r.x + 8, r.y + 5);
    textStyle(NORMAL);
    if (dev.id === 'c7' && offlineBox.checked()) {
        textSize(14);
        const tw = fontWidth('offline') + 12;
        fill('#555');
        rect(r.x + r.w - tw - 8, r.y + 4, tw, 20, 10);
        fill('white');
        textAlign(CENTER, CENTER);
        text('offline', r.x + r.w - tw / 2 - 8, r.y + 14);
    }
    // readout (attempts and successes) at the bottom of the panel
    const attempts = dev.events.length, wins = dev.events.filter(e => e.ok).length;
    const roH = stacked ? 22 : 62;
    const roY = r.y + r.h - roH - 4;
    stroke('lightsteelblue');
    fill('#f3f8fc');
    rect(r.x + 6, roY, r.w - 12, roH, 5);
    noStroke();
    fill('#111');
    textSize(14);
    textAlign(LEFT, TOP);
    const ro1 = stacked ? 'Attempts: ' + attempts + ' of 7 \u00b7 Successes: ' + wins
                        : 'Attempts counted: ' + attempts + ' of 7';
    const ro1b = 'Successes counted: ' + wins;
    const ro2 = rule === 'union'
        ? 'Version vector {c7: ' + dev.vv.c7 + ', f2: ' + dev.vv.f2 + '}'
        : 'Snapshot stamp: ' + (lastWrite(dev) || 'none');
    textStyle(BOLD);
    text(fitText(ro1, r.w - 20), r.x + 11, roY + 3);
    if (!stacked) text(fitText(ro1b, r.w - 20), r.x + 11, roY + 21);
    textStyle(NORMAL);
    if (!stacked) { fill('#444'); text(fitText(ro2, r.w - 20), r.x + 11, roY + 40); }
    hitBoxes.push({ x: r.x + 6, y: roY, w: r.w - 12, h: roH,
        tip: rule === 'union'
            ? 'Computed by folding this device’s local event set: ' + attempts + ' answer events, ' + wins +
              ' with success = true. The set is sorted by HLC, so every replica that holds the same events ' +
              'computes the same summary. The version vector says which segments it has ingested from each device.'
            : 'Computed from this device’s current snapshot: ' + attempts + ' answer events, ' + wins +
              ' with success = true. Under last writer wins, a pulled snapshot replaces the whole local record.' });

    // event tiles, sorted by HLC; discarded tiles (LWW) shown as dashed ghosts
    const tiles = dev.events.map(e => ({ e, ghost: false })).concat(dev.discarded.map(e => ({ e, ghost: true })));
    const areaTop = r.y + 28, areaBottom = roY - 4;
    const cols = stacked ? 3 : 1;
    const tw = (r.w - 12 - (cols - 1) * 5) / cols;
    const th = stacked ? 22 : 24;
    tiles.forEach((t, i) => {
        const cx = r.x + 6 + (i % cols) * (tw + 5);
        const cy = areaTop + floor(i / cols) * (th + 4);
        if (cy + th > areaBottom) return;
        drawEventTile(t.e, cx, cy, tw, th, t.ghost);
    });
    if (tiles.length === 0) {
        fill('#666');
        textSize(14);
        textAlign(LEFT, TOP);
        text('No answers yet', r.x + 8, areaTop + 2);
    }
}

function drawEventTile(e, x, y, w, h, ghost) {
    if (ghost) {
        stroke('#b00020');
        drawingContext.setLineDash([4, 3]);
        fill(255, 255, 255, 120);
    } else {
        stroke(e.device_id === 'c7' ? '#0072B2' : '#E69F00');
        fill(e.device_id === 'c7' ? '#DCEBF7' : '#FBE7C6');
    }
    rect(x, y, w, h, 4);
    drawingContext.setLineDash([]);
    noStroke();
    textSize(14);
    textAlign(LEFT, CENTER);
    fill(ghost ? '#8a8a8a' : '#111');
    const label = e.hlc + (canvasWidth < 500 ? ' ' : ' \u00b7 ') + e.device_id;
    text(fitText(label, w - 26), x + 5, y + h / 2);
    // correctness as a symbol, not only a color
    textStyle(BOLD);
    fill(ghost ? '#aaaaaa' : (e.ok ? '#007A5A' : '#C0392B'));
    textAlign(RIGHT, CENTER);
    text(e.ok ? '✓' : '✗', x + w - 6, y + h / 2);
    textStyle(NORMAL);
    if (ghost) {
        stroke('#b00020');
        line(x + 4, y + h / 2, x + w - 22, y + h / 2);
        noStroke();
    }
    hitBoxes.push({ x, y, w, h, tip: (ghost ? 'DISCARDED by last writer wins. ' : '') +
        'id: ' + e.id + '\ndevice_id: ' + e.device_id + '\nseq: ' + e.seq + '\nhlc: ' + e.hlc +
        '\nsuccess: ' + e.ok });
}

function drawS3(r, stacked) {
    panel(r, '#fbfbf6', 'darkkhaki');
    noStroke();
    fill('black');
    textAlign(LEFT, TOP);
    textSize(15);
    textStyle(BOLD);
    text(fitText('S3 student prefix', r.w - 16), r.x + 8, r.y + 5);
    textStyle(NORMAL);
    const top = r.y + 28;
    textSize(14);
    if (rule === 'union') {
        if (!s3.segments.length) { fill('#666'); text('No segments yet', r.x + 8, top + 2); return; }
        let y = top;
        s3.segments.forEach(sg => {
            const sx = r.x + 6, sw = r.w - 12;
            const tip = 'An immutable segment written once with If-None-Match: * (create-if-absent). ' +
                'Device ' + sg.device_id + ', seq ' + sg.seq + ', ' + sg.events.length +
                ' events. Segments are the truth; they are never rewritten.\n' +
                sg.events.map(e => e.hlc + (e.ok ? ' \u2713' : ' \u2717')).join('   ');
            if (stacked) {
                // one line per segment: its key and event count
                stroke('darkkhaki');
                fill('white');
                rect(sx, y, sw, 21, 4);
                noStroke();
                fill('#222');
                textAlign(LEFT, CENTER);
                text(fitText('devices/' + sg.device_id + '/seg/' + sg.seq + '.jsonl.gz \u00b7 ' +
                     sg.events.length + ' events', sw - 10), sx + 5, y + 11);
                hitBoxes.push({ x: sx, y, w: sw, h: 21, tip });
                y += 25;
                return;
            }
            const lh = 18;
            const sh = 24 + sg.events.length * lh + 4;
            stroke('darkkhaki');
            fill('white');
            rect(sx, y, sw, sh, 4);
            noStroke();
            fill('#333');
            textStyle(BOLD);
            textAlign(LEFT, TOP);
            text(fitText('devices/' + sg.device_id + '/seg/' + sg.seq + '.jsonl.gz', sw - 10), sx + 5, y + 4);
            textStyle(NORMAL);
            sg.events.forEach((e, k) => {
                fill('#222');
                text(fitText(e.hlc + (e.ok ? '  \u2713' : '  \u2717'), sw - 10), sx + 8, y + 24 + k * lh);
            });
            hitBoxes.push({ x: sx, y, w: sw, h: sh, tip });
            y += sh + 6;
        });
    } else {
        const rec = s3.record;
        if (!rec) { fill('#666'); text('No record.json yet', r.x + 8, top + 2); return; }
        const lh = 18;
        const sh = stacked ? 40 : min(r.h - 34, 44 + rec.events.length * lh);
        stroke('darkkhaki');
        fill('white');
        rect(r.x + 6, top, r.w - 12, sh, 4);
        noStroke();
        fill('#333');
        textAlign(LEFT, TOP);
        textStyle(BOLD);
        text(fitText(stacked ? 'record.json (snapshot) \u00b7 ' + rec.events.length + ' attempts'
                             : 'record.json (snapshot)', r.w - 22), r.x + 11, top + 3);
        textStyle(NORMAL);
        text(fitText('written by ' + rec.writer + ' \u00b7 stamp ' + rec.lastWrite, r.w - 22), r.x + 11, top + 21);
        if (!stacked) {
            rec.events.forEach((e, k) => {
                fill('#222');
                text(fitText(e.hlc + ' ' + e.device_id + (e.ok ? ' \u2713' : ' \u2717'), r.w - 30), r.x + 14, top + 42 + k * lh);
            });
        }
        hitBoxes.push({ x: r.x + 6, y: top, w: r.w - 12, h: sh, tip: 'One mutable snapshot of the whole ' +
            'record. Whoever writes last replaces everything in it; the stamp is the newest HLC the writer held.\n' +
            rec.events.map(e => e.hlc + ' ' + e.device_id + (e.ok ? ' \u2713' : ' \u2717')).join('   ') });
    }
}

// Packets moving between a device column and the S3 column during a sync
function drawPackets(R) {
    if (!job || !job.items.length) return;
    const dur = 800;
    const p = constrain((millis() - job.t0) / dur, 0, 1);
    const e = p < 0.5 ? 2 * p * p : 1 - pow(-2 * p + 2, 2) / 2;   // ease in-out
    const dr = R[job.dev], sr = R.s3;
    const from = job.phase === 'push' ? dr : sr, to = job.phase === 'push' ? sr : dr;
    job.items.forEach((it, i) => {
        const fx = from.x + from.w / 2, fy = from.y + from.h / 2 + i * 28;
        const tx = to.x + to.w / 2, ty = to.y + to.h / 2 + i * 28;
        const x = lerp(fx, tx, e), y = lerp(fy, ty, e);
        textSize(14);
        const w = fontWidth(it.label) + 16;
        stroke('#6A3D9A');
        strokeWeight(2);
        fill('#EFE6F7');
        rect(x - w / 2, y - 12, w, 24, 12);
        strokeWeight(1);
        noStroke();
        fill('#3d1f5c');
        textAlign(CENTER, CENTER);
        text(it.label, x, y);
    });
    noStroke();
    fill('#3d1f5c');
    textSize(14);
    textAlign(CENTER, BOTTOM);
    text(job.phase === 'push' ? 'push → S3' : 'pull ← S3', sr.x + sr.w / 2, sr.y + sr.h - 6);
}

function drawBanner(x, y, w, h) {
    const both = devices.c7.answered && devices.f2.answered;
    const ready = both && devices.c7.lastSyncStamp === changeStamp && devices.f2.lastSyncStamp === changeStamp && !job;
    if (!ready) {
        stroke('silver');
        fill(255, 255, 255, 170);
        rect(x, y, w, h, 8);
        noStroke();
        fill('#555');
        textSize(14);
        textAlign(LEFT, CENTER);
        const msg = both ? 'Sync both devices after the last answer to compare their summaries.'
                         : 'The comparison banner appears once all seven attempts exist and both devices have synced.';
        wrapLines(msg, w - 20).slice(0, 2).forEach((ln, i, a) => text(ln, x + 10, y + h / 2 + (i - (a.length - 1) / 2) * 17));
        return;
    }
    const a = devices.c7, b = devices.f2;
    const ids = d => d.events.map(e => e.id).sort().join(',');
    const same = ids(a) === ids(b);
    const held = new Set(a.events.concat(b.events).map(e => e.id));
    (rule === 'union' ? s3.segments.flatMap(s => s.events) : (s3.record ? s3.record.events : [])).forEach(e => held.add(e.id));
    const lost = CB_ANSWERS.map(e => Object.assign({ device_id: 'c7' }, e))
        .concat(LAP_ANSWERS.map(e => Object.assign({ device_id: 'f2' }, e)))
        .filter(e => !held.has(e.id));
    const good = same && a.events.length === TOTAL_ATTEMPTS;
    stroke(good ? '#009E73' : '#D55E00');
    strokeWeight(2);
    fill(good ? '#e3f4ec' : '#fbe9e1');
    rect(x, y, w, h, 8);
    strokeWeight(1);
    noStroke();
    fill('#111');
    textSize(14);
    textAlign(LEFT, CENTER);
    let msg = (same ? 'Summaries identical. ' : 'Summaries differ. ') +
        'Chromebook counts ' + a.events.length + ' of 7 attempts, laptop counts ' + b.events.length + ' of 7.';
    if (lost.length) {
        msg += ' Lost for good: ' + lost.length + ' (' + lost.map(e => e.hlc + ' ' + e.device_id).join(', ') + ').';
    } else if (!same) {
        msg += ' Nothing is lost yet: sync again so each device pulls what it lacks.';
    } else {
        msg += ' No attempt was lost.';
    }
    textStyle(BOLD);
    wrapLines(msg, w - 20).slice(0, 3).forEach((ln, i, arr) => text(ln, x + 10, y + h / 2 + (i - (arr.length - 1) / 2) * 17));
    textStyle(NORMAL);
}

function drawControlLabels() {
    noStroke();
    fill('black');
    textSize(canvasWidth < 500 ? 14 : 15);
    textAlign(LEFT, CENTER);
    controlLabels.forEach(l => {
        if (l.key === 'rule') text(canvasWidth < 500 ? 'Rule:' : 'Merge rule:', l.x, l.y);
    });
}

function drawTooltip() {
    if (mouseY < 0 || mouseY > drawHeight) return;
    let tip = null;
    for (let i = hitBoxes.length - 1; i >= 0; i--) {
        const b = hitBoxes[i];
        if (mouseX >= b.x && mouseX <= b.x + b.w && mouseY >= b.y && mouseY <= b.y + b.h) { tip = b.tip; break; }
    }
    if (!tip) return;
    textSize(14);
    const w = min(320, canvasWidth - 20);
    let lines = [];
    tip.split('\n').forEach(part => { lines = lines.concat(wrapLines(part, w - 16)); });
    const h = lines.length * 18 + 12;
    let x = mouseX + 14, y = mouseY + 14;
    if (x + w > canvasWidth - 4) x = mouseX - w - 10;
    if (x < 4) x = 4;
    if (y + h > drawHeight - 2) y = max(4, mouseY - h - 10);
    stroke('dimgray');
    fill(255, 255, 240, 245);
    rect(x, y, w, h, 6);
    noStroke();
    fill('#111');
    textAlign(LEFT, TOP);
    lines.forEach((ln, i) => text(ln, x + 8, y + 7 + i * 18));
}

// ---------- text helpers ----------
function wrapLines(str, w) {
    const words = str.split(' ');
    const lines = [];
    let cur = '';
    for (const wd of words) {
        const test = cur ? cur + ' ' + wd : wd;
        if (fontWidth(test) > w && cur) { lines.push(cur); cur = wd; } else cur = test;
    }
    if (cur) lines.push(cur);
    return lines;
}

function fitText(str, w) {
    if (fontWidth(str) <= w) return str;
    let s = str;
    while (s.length > 1 && fontWidth(s + '…') > w) s = s.slice(0, -1);
    return s + '…';
}

// ---------- responsive design ----------
function windowResized() {
    updateCanvasSize();
    resizeCanvas(canvasWidth, canvasHeight);
    layoutControls();
}

function updateCanvasSize() {
    const container = document.querySelector('main');
    if (container) canvasWidth = container.offsetWidth;
}
