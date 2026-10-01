# Claude Skill for Temperature and Pressure

!!! prompt
    Use the microsim-p5 skill to create a new microsim called `temp-and-pressure`.  Please use the same
    layout as the @docs/sims/browianian-motion microsim.  But in this case, we will ONLY allow the
    user to change the temperature as a slider.  There will be a Start Simulation/Pause Simulation
    button to the left of the control region.

    The purpose of this MicroSim is to show how an increase in temperature causes atoms to move
    faster in a container and also increases pressure.

    Here is the hard part.  I want you to make the temperature slider to show the temperature
    in degrees farinhight or celsius.  Add a radio button in the lower right corner that allows the user
    to change the type of measurement from farinhight or celsius.

    I want you to place a small animation above the control region in the drawing area.
    We will call this the 'ice_fire' region.  It is 50 high and spans the width of the canvas.
    When the temperature is below 0 degrees C, the ice-fire region shows ice cubes.  When
    the temperature goes above 0 the ice_fire region shows small flames.  The hotter the
    temperature the more small flames appear.

    The drawing area should a rectangle with many small circles representing atoms.
    The hotter the temperature, the faster the circles move.
    A counter on the upper right shows the number of times the atoms hit the wall per
    unit of time.

    The user cannot change the number of circles. This value is fixed at 100.