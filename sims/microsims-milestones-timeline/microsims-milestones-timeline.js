// MicroSims Milestones Timeline - vis-timeline
// CANVAS_HEIGHT: 580
// Learning objective (Remember / identify): the learner identifies the major milestones between
// MicroSims 1.0 and MicroSims 2.0 and orders them in time.
// Layout (fixed 580px): toolbar with a "Group by" select, the timeline, a navigation bar
// (pan and zoom buttons), and a details panel that shows the clicked milestone.
// Wheel zoom is enabled only when the page is opened on its own (fullscreen); inside an iframe
// the wheel scrolls the textbook page and the buttons zoom instead.

// ===========================================
// DATA (dates and labels from the Chapter 1 specification)
// ===========================================
const themes = {
    book:  { name: 'Book',  className: 'book' },
    paper: { name: 'Paper', className: 'paper' },
    tools: { name: 'Tools', className: 'tools' },
    anthropic: { name: 'Anthropic Announcements', className: 'anthropic' }
};

const milestones = [
    {
        id: 12, date: new Date(2023, 10, 4, 12), display: 'November 4, 2023', theme: 'book',
        short: 'MicroSim term coined',
        title: 'The term "MicroSim" is coined',
        text: 'The term "MicroSim" first appeared in a Medium article, "Micro Simulations for ' +
            'Education". It names small, focused, browser-based simulations that a teacher ' +
            'or student can create with generative AI.',
        link: 'https://dmccreary.medium.com/micro-simulations-for-education-6989eae8d85d',
        linkText: 'Read the article on Medium'
    },
    {
        id: 1, date: new Date(2023, 10, 21, 12), display: 'November 21, 2023', theme: 'book',
        short: 'MicroSims 1.0 first commit',
        title: 'First commit of MicroSims 1.0',
        text: 'The first commit started MicroSims 1.0, a course on using generative AI to ' +
            'create p5.js simulations. Most of the roughly 115 MicroSims in that first book ' +
            'were p5.js sketches with a drawing region above a control region.'
    },
    {
        id: 9, date: new Date(2024, 11, 3, 12), display: 'December 3, 2024', theme: 'book',
        short: 'Intelligent textbooks repo',
        title: 'First commit of the intelligent-textbooks project',
        text: 'The first commit to the intelligent-textbooks repository began the work on ' +
            'textbooks that pair readable content with interactive, AI-generated ' +
            'simulations. MicroSims became the building blocks of that approach.'
    },
    {
        id: 10, date: new Date(2025, 1, 24, 12), display: 'February 24, 2025', theme: 'anthropic',
        short: 'Claude Code released',
        title: 'Anthropic introduces Claude Code',
        text: 'Anthropic released Claude Code as a research preview, an AI coding agent that ' +
            'reads a project, edits files and runs commands from the terminal. It made it ' +
            'practical to build and revise whole MicroSims by describing them.'
    },
    {
        id: 11, date: new Date(2025, 9, 16, 12), display: 'October 16, 2025', theme: 'anthropic',
        short: 'Claude Skills released',
        title: 'Anthropic introduces Agent Skills',
        text: 'Anthropic introduced Agent Skills, folders of instructions, scripts and ' +
            'resources that Claude loads when a task calls for them. Skills let the steps ' +
            'for creating a MicroSim be written down once and reused.'
    },
    {
        id: 7, date: new Date(2025, 2, 17, 12), display: 'March 17, 2025', theme: 'tools',
        short: 'First use of Claude Code',
        title: 'First use of Claude Code',
        text: 'Claude Code, an AI coding agent that works in the terminal, was first used on ' +
            'this project. The evidence is a CLAUDE.md file, which gives the agent standing ' +
            'context about the repository, committed on this date.'
    },
    {
        id: 8, date: new Date(2025, 11, 10, 12), display: 'December 10, 2025', theme: 'tools',
        short: 'First MicroSim skill',
        title: 'First MicroSim generator skill',
        text: 'The first microsim-generator skill was committed to the skills repository. A ' +
            'skill packages the steps, templates and rules for building a MicroSim so an AI ' +
            'agent can repeat them, which moved MicroSim creation from ad hoc prompts toward ' +
            'a reusable workflow.'
    },
    {
        id: 2, date: new Date(2025, 9, 15), display: 'October 2025', theme: 'paper',
        short: 'Paper draft v0.02',
        title: 'First arXiv-style paper draft (v0.02)',
        text: 'The first draft of an arXiv-style paper about MicroSims was written, numbered ' +
            'v0.02. Writing for a research audience asks for precise definitions and claims ' +
            'that can be checked, a theme that runs through MicroSims 2.0.'
    },
    {
        id: 3, date: new Date(2025, 10, 15), display: 'November 2025', theme: 'paper',
        short: 'Paper draft v0.06',
        title: 'Paper draft v0.06',
        text: 'About a month after the first draft, the paper had reached version v0.06. ' +
            'Numbered drafts, like Git commits, record small steps that can be compared.'
    },
    {
        id: 4, date: new Date(2026, 8, 26, 12), display: 'September 26, 2026', theme: 'tools',
        short: 'xAPI skill v0.2',
        title: 'Skill for adding xAPI events to a MicroSim (v0.2)',
        text: 'An AI skill for adding xAPI events to an existing MicroSim reached version ' +
            '0.2. It points toward instrumented MicroSims, which report learner interactions ' +
            'as evidence.'
    },
    {
        id: 6, date: new Date(2026, 8, 30, 12), display: 'September 30, 2026', theme: 'book',
        short: 'Tag v1.0; rewrite begins',
        title: 'Tag v1.0 marks the original book; the rewrite begins',
        text: 'The original book was tagged v1.0 in Git, so it stays available in the ' +
            'project\'s version history. The same day, work began on the complete rewrite ' +
            'you are reading, MicroSims 2.0.'
    }
];

// ===========================================
// STATE
// ===========================================
let timeline = null;
let items = null;
let groupMode = 'theme';
const DAY = 24 * 60 * 60 * 1000;
const YEAR = 365.25 * DAY;
const LABEL_HALF_WIDTH = 92;   // px: half of the widest item box, used to pad the window

function isInIframe() {
    try { return window.self !== window.top; } catch (e) { return true; }
}

function buildItems() {
    return milestones.map(m => {
        const item = {
            id: m.id,
            content: m.short,
            start: m.date,
            type: 'box',
            className: themes[m.theme].className,
            title: '<b>' + m.title + '</b><br/>' + m.display
        };
        if (groupMode === 'theme') item.group = m.theme;
        return item;
    });
}

function buildGroups() {
    return new vis.DataSet(Object.keys(themes).map((k, i) => ({
        id: k, content: themes[k].name, order: i
    })));
}

// Show every milestone with enough padding that the edge labels are not clipped:
// pad = labelHalf * span / (width - 2 * labelHalf)
function fitAll() {
    const times = milestones.map(m => m.date.getTime());
    const minT = Math.min(...times), maxT = Math.max(...times);
    const span = maxT - minT;
    const container = document.getElementById('timeline');
    const labelColumn = groupMode === 'theme' ? 70 : 0;
    const width = Math.max(200, container.clientWidth - labelColumn);
    const pad = LABEL_HALF_WIDTH * span / Math.max(60, width - 2 * LABEL_HALF_WIDTH) + 20 * DAY;
    timeline.setWindow(new Date(minT - pad), new Date(maxT + pad), { animation: false });
}

// Zoom around the selected milestone if there is one, otherwise around the window center
function zoomBy(factor) {
    const w = timeline.getWindow();
    const sel = timeline.getSelection();
    const m = sel.length ? milestones.find(x => x.id === sel[0]) : null;
    const center = m ? m.date.getTime() : (w.start.getTime() + w.end.getTime()) / 2;
    const half = (w.end.getTime() - w.start.getTime()) * factor / 2;
    timeline.setWindow(new Date(center - half), new Date(center + half), { animation: true });
}

function panBy(fraction) {
    const w = timeline.getWindow();
    const shift = (w.end.getTime() - w.start.getTime()) * fraction;
    timeline.setWindow(new Date(w.start.getTime() + shift), new Date(w.end.getTime() + shift),
        { animation: true });
}

function setGroupMode(mode) {
    groupMode = mode;
    const selected = timeline.getSelection();
    if (mode === 'theme') {
        timeline.setGroups(buildGroups());
    } else {
        timeline.setGroups(null);
    }
    items.clear();
    items.add(buildItems());
    timeline.setSelection(selected);
    fitAll();
}

function showDetails(id) {
    const box = document.getElementById('event-details');
    const m = milestones.find(x => x.id === id);
    if (!m) {
        box.innerHTML = '<p class="hint">Click a milestone to read about it. Drag the timeline ' +
            'to pan. To separate the two September 2026 events, click one of them and ' +
            'press + Zoom a few times.</p>';
        return;
    }
    const order = milestones.slice().sort((a, b) => a.date - b.date).findIndex(x => x.id === id) + 1;
    box.innerHTML =
        '<div><span class="when">' + m.display + ' &middot; milestone ' + order + ' of ' +
        milestones.length + ' &middot; ' + themes[m.theme].name + '</span></div>' +
        '<div class="what">' + m.title + '</div>' +
        '<p>' + m.text + (m.link ? ' <a href="' + m.link + '" target="_blank" rel="noopener">' +
            m.linkText + '</a>' : '') + '</p>';
}

function renderLegend() {
    document.getElementById('legend').innerHTML = 'Themes: ' +
        Object.keys(themes).map(k => '<span class="swatch ' + themes[k].className + '"></span>' +
            themes[k].name).join('');
}

// ===========================================
// STARTUP
// ===========================================
document.addEventListener('DOMContentLoaded', function () {
    const container = document.getElementById('timeline');
    const wheelZoom = !isInIframe();
    items = new vis.DataSet(buildItems());
    const options = {
        width: '100%',
        height: '100%',
        orientation: 'bottom',
        align: 'center',
        stack: true,
        selectable: true,
        showCurrentTime: false,
        moveable: true,          // drag to pan
        zoomable: wheelZoom,     // wheel zoom only when opened on its own
        zoomMin: 7 * DAY,
        zoomMax: 12 * YEAR,
        min: new Date(2019, 0, 1),
        max: new Date(2031, 0, 1),
        margin: { item: { horizontal: 6, vertical: 8 }, axis: 12 },
        tooltip: { followMouse: true, overflowMethod: 'cap' },
        groupOrder: 'order'
    };
    timeline = new vis.Timeline(container, items, buildGroups(), options);

    // Inside an iframe, let vertical wheel movement scroll the page instead of the timeline
    if (!wheelZoom) {
        container.addEventListener('wheel', function (e) {
            if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) {
                e.stopImmediatePropagation();
            } else {
                e.preventDefault();
                const w = timeline.getWindow();
                const shift = (e.deltaX / container.clientWidth) * (w.end - w.start);
                timeline.setWindow(new Date(w.start.valueOf() + shift),
                    new Date(w.end.valueOf() + shift), { animation: false });
            }
        }, true);
    }

    timeline.on('select', function (props) {
        showDetails(props.items.length ? props.items[0] : null);
    });

    document.getElementById('group-select').addEventListener('change', function (e) {
        setGroupMode(e.target.value);
    });
    document.getElementById('zoom-in').addEventListener('click', () => zoomBy(0.5));
    document.getElementById('zoom-out').addEventListener('click', () => zoomBy(2));
    document.getElementById('fit-all').addEventListener('click', fitAll);
    document.getElementById('pan-left').addEventListener('click', () => panBy(-0.3));
    document.getElementById('pan-right').addEventListener('click', () => panBy(0.3));

    let resizeTimer = null;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () { timeline.redraw(); fitAll(); }, 150);
    });

    renderLegend();
    showDetails(null);
    fitAll();
});
