export const tracks=['Circuits','Mechanisms','Motion & control','Kinetic art & music','Expressive creatures','Computer vision & AI','Home automation'];
export const parts=[
['meter','Multimeter','Tools','1','Owned'],['uno','GeauxRobot Uno R3-compatible ATmega328P','Boards','1','Owned'],['nano','Elegoo Nano V3.0 classic','Boards','3','Owned'],['duem','Arduino Duemilanove','Boards','1','Owned'],['feather','Adafruit Feather HUZZAH ESP8266','Boards','1','Owned'],['ethernet','Arduino Uno Ethernet shield','Boards','1','Owned'],['lcd','Nokia 5110 prototype expansion shield','Displays','1','Owned'],['stepper','Stepper motor and driver PCB','Motion','1 set','Owned'],['proto','Prototype board and expansion PCB','Prototyping','1 each','Owned'],['res','Resistor assortment','Components','Assorted','Owned'],['led','LED assortment','Components','Assorted','Owned'],['sensor','Starter-kit sensors','Components','Models to verify','Owned'],['switch','Switches and buttons','Components','Assorted','Owned'],['buzzer','Buzzers','Components','Models to verify','Owned'],['wire','Jumper wires','Prototyping','Assorted','Owned'],['battery','Battery case','Power','1','Owned'],['remote','Remote control','Components','1','Owned'],['bread','Solderless breadboard','Prototyping','Verify kit board type','Verify'],['usb','Compatible USB data cable','Power','Check board connectors','Verify'],['cells','Batteries for holder','Power','Verify voltage and cell count','Verify'],['pot','10 kΩ potentiometer','Components','Check kit contents','Verify'],['servo','Micro servo and suitable low-voltage supply','Motion','1 set','Needed'],['card','Cardboard, brads and tape','Mechanisms','Assorted','Verify'],['cam','Webcam or built-in laptop camera','Computer vision','1','Verify'],['print','3D printer access and filament','Fabrication','One small print','Needed'],['stepPower','Suitable stepper power supply','Power','Match motor and driver labels','Verify']
].map(([id,name,category,quantity,state])=>({id,name,category,quantity,state,notes:''}));
export const phases=[
['Bench basics','Make: Electronics, 3rd Edition','Battery circuits, breadboard rows, polarity and the multimeter. Predict what you expect to measure before each experiment.','Continuity check|LED resistor test|Try a switch|Repeat and document'],
['Arduino fundamentals','Uno R3 and built-in examples','Start with the Uno you own. Use GPIO, serial output, PWM and timing. Put your software experience to work after the circuit checks out.','Blink and serial|Button input|PWM and a knob|Nonblocking timing'],
['Embedded systems','Inputs, outputs and state','Calibrate an input, separate input from output logic, and use a driver for motion. Verify each module’s model and voltage first.','Sensor threshold|Stepper driver|State machine|Optional local web status'],
['Motion & mechanisms','A mechanism you can hold','Prototype motion with cardboard and linkages. Add actuation after you can cycle the mechanism by hand.','Paper linkage|Stepper positioning|Creature gesture|Film and measure'],
['Robotics software','Simulation and perception','Use your programming and math background for coordinates, feedback and state. Start in simulation and try local camera input independently.','Webots setup|Drive to a target|Compare control gains|Camera color tracking'],
['Fabrication & iteration','CAD, 3D printing and manufacturing','Measure a real part, model a small interface and test fit. Compare a 3D print with a hand-cut prototype and record the tolerance.','Measure|Model a bracket|Print a fit coupon|Revise and document']
].map(([title,source,desc,weeks],i)=>({id:String(i+1),title,source,desc,weeks:weeks.split('|')}));
export const projects=[
['continuity','Map a breadboard','Circuits',1,30,1,'0–8',5,3,2,'Use continuity mode on an unpowered board. Mark three connected pairs and one isolated pair.','meter bread',''],
['led','One LED, two resistors','Circuits',1,45,1,'0–8',5,4,2,'On a low-voltage breadboard circuit, compare two correctly sized resistors. Record supply voltage and voltage across each resistor, then calculate current.','meter res led wire bread battery cells','continuity'],
['blink','Blink with a serial heartbeat','Circuits',2,35,1,'0–6',4,3,2,'Upload Blink to the Uno and show five timestamped transitions in the serial monitor.','uno usb',''],
['button','A button with one clean count','Circuits',2,55,2,'0–8',5,3,3,'Use an internal pull-up and debounce in code. Get exactly one count for each of ten presses.','uno usb bread wire switch','blink continuity'],
['knob','A knob that dims an LED','Circuits',2,65,2,'0–10',4,4,3,'Read a potentiometer, map the range to PWM and note the brightness at three knob positions.','uno usb bread wire res led pot','led blink'],
['rhythm','Two rhythms, one timer','Kinetic art & music',2,60,2,'0–8',5,5,4,'Schedule two patterns with millis(). Keep a visual beat running while a correctly rated buzzer plays an independent pattern.','uno usb bread wire buzzer led res','led blink'],
['sensor','Light-triggered desk reminder','Home automation',3,70,2,'0–12',5,4,4,'Choose a suitable verified light sensor or source one. Log bright and dark readings, then demonstrate that hysteresis prevents rapid toggling.','uno usb sensor bread wire led res','knob'],
['step','Stepper returns to zero','Motion & control',3,85,3,'0–15',5,5,4,'Identify your motor and driver and check supply requirements. Mark a zero position and repeat a 90° excursion five times, measuring return error.','uno usb stepper stepPower wire','blink'],
['wifi','Local desk-status page','Home automation',3,90,3,'0–8',4,4,4,'On the ESP8266, serve a status page on your local network. Verify ten refreshes match the board’s state.','feather usb','blink'],
['linkage','Cardboard four-bar study','Mechanisms',4,50,1,'0–8',5,5,4,'Make a hand-cranked linkage. Trace the output point for two pivot locations and photograph both variants.','card',''],
['creature','A creature that perks up','Expressive creatures',4,90,3,'12–30',5,5,5,'Build a single moving ear. Demonstrate idle, perk and settle using one input, bounded motion and a suitable servo supply.','uno usb servo switch card wire','button linkage'],
['orbit','Stepped kinetic pattern','Kinetic art & music',4,85,3,'0–12',4,5,5,'Drive a lightweight paper disc with two timing patterns. Record a 15-second clip of each and describe their visual rhythm.','uno usb stepper stepPower wire card','step linkage'],
['drive','Simulated drive to a target','Motion & control',5,85,3,'0',5,4,5,'In Webots, log distance to a target for two controller gains. Reach within 10 cm in three runs and plot the error.','',''],
['vision','Track a colored object','Computer vision & AI',5,75,3,'0',5,5,5,'Use local OpenCV to overlay a centroid. Record ten trials under two lighting conditions and count successful tracks.','cam',''],
['bracket','Print a motor-mount fit coupon','Mechanisms',6,95,3,'4–20',5,4,5,'Measure the motor interface, design a small test coupon, then compare printed fit against the CAD dimensions and record the next tolerance.','stepper print','step linkage']
].map(([id,name,track,phase,minutes,difficulty,cost,learning,enjoyment,portfolio,finish,needs,prereqs])=>({id,name,track,phase,minutes,difficulty,cost,learning,enjoyment,portfolio,finish,needs:needs?needs.split(' '):[],prereqs:prereqs?prereqs.split(' '):[],status:'Backlog'}));
export const schedule=[
{day:'Monday',minutes:30,task:'Read & predict',desc:'Pick one idea. Sketch the circuit or mechanism and write a prediction.'},
{day:'Wednesday',minutes:60,task:'Build & test',desc:'Assemble one change at a time. Take a few measurements.'},
{day:'Saturday',minutes:45,task:'Repeat & document',desc:'Retest, take a photo and log what changed your understanding.'},
{day:'Sunday',minutes:15,task:'Review & choose',desc:'Rate the experiment and pick a finish line for the next session.'}
];
export const resources=[
['Circuits','Make: Electronics, 3rd Edition','Charles Platt · Hands-on discrete electronics','https://make.co/gift-guides/make-electronics-3rd-edition-pdf/'],
['Circuits','Adafruit Learning System','Limor Fried and the Adafruit team · Component guides and wiring','https://learn.adafruit.com/'],
['Circuits','SparkFun Tutorials','Breadboards, reading schematics and practical electronics','https://learn.sparkfun.com/tutorials'],
['Arduino','Paul McWhorter · New Arduino Tutorials','Start with the Uno R3-oriented playlist for your ATmega328P board.','https://www.youtube.com/playlist?list=PLGs0VKk2DiYw-L-RibttcvK-WBZm8WLEP'],
['Arduino','Arduino Built-in Examples','Blink, button, debounce, analog input and timing examples','https://docs.arduino.cc/built-in-examples/'],
['Embedded','Udacity · Introduction to Robotics','Optional structured introduction','https://www.udacity.com/course/introduction-to-robotics--nd002-embsys'],
['Embedded','Udacity · Robotics and Embedded Systems','Stepper motors, sensors and communication buses','https://www.udacity.com/course/robotics-and-embedded-systems--nd003-embsys'],
['Robotics','Webots documentation','Start by simulating a small robot.','https://cyberbotics.com/doc/guide/index'],
['Robotics','ROS 2 tutorials','Add nodes, topics and services when a simulation is familiar.','https://docs.ros.org/en/jazzy/Tutorials.html'],
['Robotics','Udacity · Robotics Software Engineer','Advanced option for simulation, localization and planning','https://www.udacity.com/course/robotics-software-engineer--nd209'],
['Robotics','Underactuated Robotics','Russ Tedrake · Later reference for dynamics and control','https://underactuated.mit.edu/'],
['Vision','OpenCV Python tutorials','Image thresholding and contours for a camera bench test','https://docs.opencv.org/4.x/d6/d00/tutorial_py_root.html'],
['Fabrication','Prusa Knowledge Base','Print preparation, dimensions and troubleshooting','https://help.prusa3d.com/'],
['Mechanisms','Fourbar','Derek Lahr · Explore four-bar linkage geometry interactively','https://www.fourbar.app/'],
['Creative robotics','Disney Research','Research demos in robotic characters and expressive motion','https://www.disneyresearch.com/']
];
