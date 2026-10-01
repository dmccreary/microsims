# Generate Content for Chapter 1

!!! prompt
please rerun the chapter-content-generator skill for chapter 1
  @docs/chapters/01-intro-to-educational-microsims/index.md.  Use a positive optimistic tone and
  tell the reader that MicroSims will revolutionize education across all of Planet Earth in the
  best of all possible ways.  Both teachers and students will benefit!  Assume an undergraduate
  college reading level.

!!! prompt
    rerun the chapter-content-generator on chapter 2 at
  @docs/chapters/02-web-development-essentials/index.md    
  Use an positive and optimistic tone.
  Assure the reader that they do NOT need to be experts on web development to create awesome
  microsims.  But they do need to be able to ask LLMs precise questions, so the vocabulary of how
  you ask for help is critical to fixing the placement of items in a MicroSim and getting the
  functionality you want.

## Chapter 3

!!! prompt
  Run the chapter-content-generator skill on chapter 3 @docs/chapters/03-getting-started-with-p5js/index.md
  Make the tone is fun and joyful about learning p5.js and how it enables creativity.
  Make sure to put in a timeline about the history of the processing library and the incredible support
  that NYU has given to the p5.js library.  Let the reader know the original goal of p5.js was
  teaching non-programmers (artists) to be more creative with code.
  Focus on the simplicity of p5 and the use of the simple setup() and draw() functions which
  are universal patterns.
  Add a microsim that uses the powerful p5.js FFT library to read sound from a microphone
  that uses as few lines of code as possible.
  Add a microsim that uses a fun 3D animation.

## Chapter 4

Run the chapter-content-generator skill on chapter 4.  Tell the user that
this will be the most colorful chapter and at the end they will be able to generate their
own personal rainbow Microsims
@docs/chapters/04-drawing-animation-and-color/index.md

## Chapter 5

Run the chapter-content-generator skill on chapter 5 at @docs/sims/05-leveraging-generative-ai/index.md
Tell the user that this is where they learn both the strengths and weakness of their MicroSim development partner, the LLM.
Tell them that their tasks is to bring out the best in their partner and how to precisely ask for new MicroSims or to
adjust an existing MicroSim.

## Chapter 6

Run the chapter-content-generator skill on chapter 6 at @docs/sims/06-microsim-architecture-and-layout/index.md
Tell the reader that sometimes to impress your students you need to add some "spit and polish" to make your
MicroSims look like a million bucks.  This chapter walks you through the architecture of a microsim and
all the layout tricks to make your MicroSims look great!

## Chapter 7

Run the chapter-content-generator skill on chapter 7 at @docs/sims/07-user-interface-controls-and-events/index.md
Tell the user that by the end of this chapter they will be able to master the way a user controls
a MicroSim with a rich but consistent collection of user interface controls.  Feel free to make puns about
controlling the controls.

## Chapter 8

Run the chapter-content-generator skill on chapter 8 at @docs/sims/08-responsive-design-techniques/index.md
Tell the user that one of the quickest ways to tell a real pro from an rookie is to just resize the window.
Do the elements move gracefully together like dancers on a stage?  Or are they all frozen like statues pinned
to the left edge of a large landscape window.  Your key to the this elegant dance is to put in
rules called responsive rules where components change their position as the windows are resized.

## Chapter 9

Run the chapter-content-generator skill on chapter 9 @docs/chapters/09-blooms-taxonomy-and-learning-objectives/index.md
Tell the student that there are huge variations learning objectives. Without some guidance it would be hard
to pick what type of MicroSim to design for a given type of learning objective.  That is where the Bloom taxonomy
comes in.  It serves as a way to map a learning objective to a specific type of MicroSim.

## Chapter 10

Run the chapter-content-generator skill on chapter 10 @docs/chapters/10-charts-diagrams-and-infographics/index.md
Despite the power of p5.js, there is no "one size fits all" rule in generating MicroSims.
In this chapter we explore the world of generating interactive charts, diagrams like flowcharts and workflows and
the general topic of infographics that connect visual components with understanding.
You will learning how simple charts work and see how the types of data that you want to present will guild your
chart type.

## Chapter 11

Run the chapter-content-generator skill on chapter 11 @docs/chapters/11-maps-networks-and-timeline-visualizations/index.md
Here we get into some of the most powerful MicroSims for analyzing both concepts and their relationships.
We show that manually laying out things like an constantly changing org. Chart is both slow and painful.
Luckily there are ways to automate the layout of complex structures.  The origin story is how a team at Bell Labs created
a product called GraphVis back in the 1980s that collected many layout algorithms.  From there many
different generations of products evolved.  Today many of these layout algorithms are available through the vis-network
JavaScript library.  Let's explore how they work and how we can bring order to these complex network diagrams to
build fun and insightful MicroSims.

## Chapter 12

Log the 11 session and Run the chapter-content-generator skill on chapter 12 @docs/chapters/12-metadata-packaging-and-quality/index.md
Creating the Javascript program and the main.html are the core of the MicroSim.  But to be really useful
we need to wrap these files up in a pretty and consistent package and tie a bow around it.  How
can others tell we have used care at creating our MicroSim?  We present a consistent quality
metric so that our users know what they are getting.   These quality rules also give us hints
at what we can do to meet and exceed the expectations of our users.

## Chapter 13

Log the 12 session and Run the chapter-content-generator skill on chapter 13 @docs/chapters/13-pedagogy-assessment-and-accessibility/index.md
You might be wondering if your MicroSim should be clean and simple showing just a single
slider to control a simulation speed, or should you show off you developer prowess and
add a dozen sliders to control all aspects of your MicroSim.  Which one will provide the best
results?  In this chapter we dip into the area of learning how students learn.  This
will guide you to make the right decisions on how many features your MicroSim should have.
I should also mention that I love MicroSims with a "Quiz Mode", but sometimes that does
push us over the edge of complexity.

## Chapter 14

Log the chapter 13 session and run the chapter-content-generator skill on chapter 14 @docs/chapters.14-professional-development-and-capstone/index.md
It is my sincere hope that students are not just isolated "cowboy" (or cowgirl) programmers
that believe that the only path to success in your career is to work alone.
My prediction is that the greatest interactive intelligent books full of beautiful MicroSims
will be created by teams of people working together to build libraries of MicroSims
that are robust, reusable and are easily customized by both people and intelligent agents.
This chapter is about how you can work in teams to build project collaboratively with others.
Remembering to do a 'git pull' before you start writing code is an important habit to build
even when you are working in isolation.