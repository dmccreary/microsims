   # MicroSim Creation Workflow
   
   !!! prompt
   use the mermaid-generator skill to create a new microsim.  Use a mimimalist iframe layout with no items 
outside the drawing area.  Use tooltips. 
   
   <summary>AI-Assisted MicroSim Creation Workflow</summary>
    Type: workflow
    Name: microsim-creation-workflow

    Bloom Taxonomy: Understand

    Learning Objective: Understand the complete process of creating a MicroSim with AI assistance

    Purpose: Show how teachers transform learning objectives into working MicroSims

    Visual style: Flowchart with process rectangles, decision diamonds, and connecting arrows

    Steps:

    1. Start: "Identify Learning Objective"
       Hover text: "What specific concept should students understand? Be precise!"
       Color: Green (start)

    2. Process: "Describe the Visualization"
       Hover text: "What should students see? What should they manipulate?"
       Color: Blue

    3. Process: "Write AI Prompt"
       Hover text: "Describe the MicroSim: layout, controls, behavior, appearance"
       Color: Blue

    4. Process: "Generate Initial Code"
       Hover text: "AI produces working p5.js code based on your description"
       Color: Purple (AI step)

    5. Process: "Test in p5.js Editor"
       Hover text: "Run the code immediately—does it work as expected?"
       Color: Orange

    6. Decision: "Meets Learning Objective?"
       Hover text: "Does this MicroSim effectively teach the intended concept? Yes/No"
       Color: Yellow

    7. Process: "Refine with AI" (if No)
        Hover text: "Describe what needs to change—AI helps iterate"
        Color: Purple
        Arrow loops back to "Test in p5.js Editor"

    8. Process: "Add to Course Materials" (if Yes)
       Hover text: "Embed in textbook, LMS, or website"
       Color: Blue

    9. Process: "Gather Student Feedback"
       Hover text: "Watch how students use it, note improvements"
       Color: Orange

    10. End: "Effective Learning Tool"
       Hover text: "Students are learning through interaction!"
       Color: Green (end)

    Time annotations:
    - "Minutes, not months" spanning AI generation steps
    - "Iterate as needed" near refinement loop

    Color coding legend:
    - Green: Start/End
    - Blue: Teacher actions
    - Purple: AI-assisted steps
    - Orange: Testing/feedback
    - Yellow: Decision points

    Implementation: mermaid-generator skill