// Data Definition
window.pathwayData = {
  "Fwd": { label: "Fwd", kw: ["K00202", "K00200", "K00201", "K00203", "K00204", "K00205", "K11261", "K11260", "FwdA"] },
  "Ftr": { label: "Ftr", kw: ["K00672", "Ftr"] },
  "Mch": { label: "Mch", kw: ["K01499", "Mch"] },
  "Mtd_Hmd": { label: "Mtd/Hmd", kw: ["K13942", "K00319", "K00300", "K10714", "MtdA", "HmdA"] },
  "Mer": { label: "Mer", kw: ["K00320", "Mer"] },
  "Mtr": { label: "Mtr", kw: ["K00580", "K00579", "K00578", "K00577", "K00582", "K00583", "K00584", "MtrA"] },
  "Mcr": { label: "Mcr", kw: ["K00401", "K00402", "K03421", "K03422", "K00399", "McrA"] },
  "Ech": { label: "Ech", kw: ["K14086", "K14087", "K14088", "K14089", "K14090", "K14091"] },
  "Fpo1": { label: "Fpo", kw: ["K22158", "K22159", "K22160", "K22161", "K22162", "K22163", "K22164", "K22165", "K22166", "K22167", "K22168", "K22169", "K22170"] },
  "Fpo2": { label: "Fpo", kw: ["K22158", "K22159", "K22160", "K22161", "K22162", "K22163", "K22164", "K22165", "K22166", "K22167", "K22168", "K22169", "K22170"] },
  "MvhADG_HdrABC": { label: "MvhADG-\nHdrABC", kw: ["K14126", "K14127", "K14128", "K22480", "K22481", "K22482", "K03388", "K03389", "K03390"] },
  "CdhAB_CooSF": { label: "CdhAB\nCooSF", kw: ["K00192", "K00195", "K00196", "K00198", "CdhA", "CdhB", "CooS", "CooF"] },
  "Fdh_Fdo_Fdw": { label: "Fdh/Fdo/Fdw", kw: ["K05299", "K15022", "K22516", "K00125", "K22515", "K00123", "K00124"] },
  "Ack": { label: "Ack", kw: ["K00925", "Ack"] },
  "Pta": { label: "Pta", kw: ["K00625", "Pta"] },
  "CdhCDE": { label: "CdhCDE\n(ACDS)", kw: ["K00193", "K00194", "K00197", "CdhC", "CdhD", "CdhE"] },
  "Acs": { label: "Acs", kw: ["K15023", "K14138"] },
  "Mta": { label: "Mta", kw: ["K14080", "K04480", "K14081", "MtaA", "MtaB", "MtaC"] },
  "MtmBC": { label: "MtmBC", kw: ["K16176", "K16177", "MtmB", "MtmC"] },
  "MtbBC": { label: "MtbBC", kw: ["K16178", "K16179", "MtbB", "MtbC"] },
  "MttBC": { label: "MttBC", kw: ["K14083", "K14084", "MttB", "MttC"] },
  "MtbA": { label: "MtbA", kw: ["K14082", "MtbA"] }
};

// Example Keywords for testing
window.exampleKeywords = ["K00200", "K00580", "K00401", "K03388", "McrA", "K00925"];

window.drawPathway = function() {
drawPill({x:298, y:43, w:129, h:32, label:"Hydrogenotrophic", cls:"st35"});
drawPill({x:90, y:189, w:100, h:32, label:"Acetoclastic", cls:"st39"});
drawPill({x:70, y:423, w:110, h:32, label:"Methylotrophic", cls:"st40"});

drawText({x:360, y:92, text:"CO<sub>2</sub>", cls:"big-label"});
drawText({x:230, y:111, text:"CO", cls:"big-label"});
drawText({x:546, y:111, text:"formate", cls:"big-label"});
drawText({x:370, y:165, text:"formyl-MF"});
drawText({x:370, y:214, text:"formyl-H<sub>4</sub>SPt"});
drawText({x:370, y:260, text:"methenyl-H<sub>4</sub>SPt"});
drawText({x:370, y:312, text:"methylene-H<sub>4</sub>SPt"});
drawText({x:370, y:365, text:"methyl-H<sub>4</sub>SPt"});
drawText({x:370, y:416, text:"methyl-CoM"});
drawText({x:360, y:550, text:"CH<sub>4</sub>", cls:"big-label"});
drawText({x:419, y:452, text:"CoB-SH\nCoM-SH"});
drawText({x:407, y:515, text:"CoM-S-S-CoB"});
drawText({x:407, y:133, text:"Fd<sub>red2-</sub>", cls:"small-label"});
drawText({x:400, y:150, text:"Fd<sub>dox</sub>", cls:"small-label"});
drawText({x:425, y:278, text:"F<sub>420</sub>H<sub>2</sub>", cls:"small-label"});
drawText({x:408, y:298, text:"F<sub>420</sub>+2H<sub>2</sub>", cls:"small-label"});
drawText({x:408, y:328, text:"F<sub>420</sub>H<sub>2</sub>", cls:"small-label"});
drawText({x:395, y:349, text:"F<sub>420</sub>+2H<sub>2</sub>", cls:"small-label"});

const orange = "#f8991d";
drawLine({x1:360,y1:110,x2:360,y2:520,color:orange});
drawLine({x1:382,y1:450,x2:414,y2:450,color:orange, arrow:false});
drawLine({x1:382,y1:450,x2:382,y2:510,color:orange, arrow:false});
drawLine({x1:382,y1:510,x2:400,y2:510,color:orange});
drawLine({x1:528,y1:450,x2:476,y2:450,color:orange});
drawLine({x1:528,y1:450,x2:528,y2:510,color:orange, arrow:false});
drawLine({x1:528,y1:510,x2:498,y2:510,color:orange, arrow:false});
[108, 162, 210, 262, 310, 358, 415, 528].forEach(y => drawRing({cx:360, cy:y, color:orange}));

drawBox({id:"Fwd", x:339.51, y:126.78, w:40.04, h:22.49, cls:"st35", enzyme:true});
drawBox({id:"Ftr", x:339.33, y:174.78, w:40.04, h:22.49, cls:"st35", enzyme:true});
drawBox({id:"Mch", x:336.58, y:226.33, w:42.78, h:22.49, cls:"st35", enzyme:true});
drawBox({id:"Mtd_Hmd", x:326.53, y:274.6, w:68.56, h:22.49, cls:"st35", enzyme:true});
drawBox({id:"Mer", x:339.33, y:323.96, w:40.04, h:22.49, cls:"st35", enzyme:true});
drawBox({id:"Mtr", x:339.33, y:372.78, w:40.04, h:22.49, cls:"st35", enzyme:true});
drawBox({id:"Mcr", x:339.15, y:459.99, w:40.04, h:22.49, cls:"st35", enzyme:true});

drawBox({id:"Ech", x:460.36, y:130.9,  w:28.32, h:15.91, cls:"st34", enzyme:true});
drawBox({id:"Fpo1",x:486.14, y:278.44, w:28.32, h:15.91, cls:"st34", enzyme:true});
drawBox({id:"Fpo2",x:469.68, y:327.8,  w:28.32, h:15.91, cls:"st34", enzyme:true});
drawBox({id:"MvhADG_HdrABC", x:488.33, y:459.99, w:71.3, h:32, cls:"st35", enzyme:true});

drawLine({x1:256, y1:109, x2:354, y2:109, color:"#ef3d39"});  // CO2 to CO
drawLine({x1:496, y1:109, x2:367, y2:109, color:"#2ab34b"});
drawBox({id:"CdhAB_CooSF", x:270, y:90, w:53.2, h:36.75, cls:"st39", enzyme:true});
drawBox({id:"Fdh_Fdo_Fdw", x:388.32, y:98, w:101.47, h:22.49, cls:"st38", enzyme:true});
drawRing({cx:251, cy:109, color:"#ef3d39"});  // CO
drawRing({cx:501, cy:109, color:"#2ab34b"});  // formate

const red = "#ef3d39";
drawLine({x1:153,y1:251,x2:153,y2:349,color:red});
drawLine({x1:157, y1:358, x2:353, y2:358, color:red});
drawLine({x1:251, y1:340, x2:251, y2:116, color:red, arrow:true});
drawPath({ d: "M157,247c27.18,2.9,48.35,25.9,48.35,53.85,0,23.94-15.54,44.26-46,55", color: red, width: 2, arrow: true });
[247, 298, 357].forEach(y => drawRing({cx:153, cy:y, color:red}));
drawBox({id:"Ack", x:133.57, y:265.05, w:40.04, h:22.49, cls:"st39", enzyme:true});
drawBox({id:"Pta", x:133.85, y:309.48, w:40.04, h:22.49, cls:"st39", enzyme:true});
drawBox({id:"CdhCDE", x:217, y:340, w:66.37, h:33.46, cls:"st39", enzyme:true});
drawBox({id:"Acs", x:184, y:290, w:40.04, h:22.49, cls:"st39", enzyme:true});
drawText({x:95, y:249, text:"acetate"});
drawText({x:87, y:304, text:"acetyl-Pi"});
drawText({x:75, y:363, text:"acetyl-CoA"});

const blue = "#6f8ac6";
[482, 510, 538, 566].forEach(y => drawRing({cx:143, cy:y, color:blue}));
drawLine({x1:147, y1:482, x2:300, y2:482, color:blue, arrow:false});
drawLine({x1:147, y1:510, x2:240, y2:510, color:blue, arrow:false});
drawLine({x1:147, y1:538, x2:300, y2:538, color:blue, arrow:false});
drawLine({x1:147, y1:566, x2:240, y2:566, color:blue, arrow:false});
drawLine({x1:240, y1:510, x2:240, y2:566, color:blue, arrow:false});
drawLine({x1:300, y1:538, x2:300, y2:415, color:blue, arrow:false});
drawLine({x1:300, y1:415, x2:354, y2:415, color:blue});
drawBox({id:"Mta",   x:162.41, y:470.96, w:40.04, h:22.49, cls:"st40", enzyme:true});
drawBox({id:"MtmBC", x:162.41, y:497.83, w:59.59, h:22.49, cls:"st40", enzyme:true});
drawBox({id:"MtbBC", x:162.41, y:525.26, w:59.59, h:22.49, cls:"st40", enzyme:true});
drawBox({id:"MttBC", x:162.41, y:552.68, w:58.59, h:22.49, cls:"st40", enzyme:true});
drawBox({id:"MtbA",  x:250,  y:525.26, w:40.57, h:22.49, cls:"st40", enzyme:true});
drawText({x:70, y:485, text:"methanol"});
drawText({x:50, y:513, text:"methylamine"});
drawText({x:40, y:541, text:"dimethylamine"});
drawText({x:35,  y:569,  text:"trimethylamine"});

// Three orange curved paths (left)
drawPath({ d: "M391,343.97c-6.1-1.64-10.17-4.58-10.17-7.94,0-5.15,9.58-9.32,21.39-9.32", color: orange });
drawPath({ d: "M407,293.51c-6.1-1.64-10.17-4.58-10.17-7.94,0-5.15,9.58-9.32,21.39-9.32", color: orange });
drawPath({ d: "M391,147.06c-6.1-1.64-10.17-4.58-10.17-7.94,0-5.15,9.58-9.32,21.39-9.32", color: orange });

// Three orange curved paths (right)
drawPath({ d: "M444,131.18c6.1,1.64,10.17,4.58,10.17,7.94,0,5.15-9.58,9.32-21.39,9.32", color: orange });
drawPath({ d: "M454,329.19c6.1,1.64,10.17,4.58,10.17,7.94,0,5.15-9.58,9.32-21.39,9.32", color: orange });
drawPath({ d: "M470.68,279.27c6.1,1.64,10.17,4.58,10.17,7.94,0,5.15-9.58,9.32-21.39,9.32", color: orange });
};

// Execute immediately
if (typeof window.drawPathway === 'function') {
    window.drawPathway();
}
