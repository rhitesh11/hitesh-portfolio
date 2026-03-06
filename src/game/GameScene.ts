import Phaser from "phaser";
import VirtualJoystick from "phaser3-rex-plugins/plugins/virtualjoystick.js";

export default class GameScene extends Phaser.Scene {

  private npcs:{sprite:Phaser.Physics.Arcade.Sprite,text:Phaser.GameObjects.Text}[]=[];
  private player!:Phaser.Physics.Arcade.Sprite;

  private cursors!:Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!:any;
  private interactKey!:Phaser.Input.Keyboard.Key;

  private buildings:{sprite:Phaser.GameObjects.Rectangle,id:string}[]=[];
  private currentBuilding:string|null=null;

  private onEnterBuilding!:(id:string)=>void;

  private interactionText!:Phaser.GameObjects.Text;
  private characterType:"male"|"female"="male";

  private cars:Phaser.Physics.Arcade.Sprite[]=[];
  private miniMap!:Phaser.Cameras.Scene2D.Camera;
  private horizontalCars: Phaser.Physics.Arcade.Sprite[] = [];
private verticalCars: Phaser.Physics.Arcade.Sprite[] = [];

private trafficTurn:"horizontal"|"vertical"="horizontal";

private pedestrians: Phaser.Physics.Arcade.Sprite[] = [];
private npcMovementStarted = false;
private joystick!: any;
private interactButton!: Phaser.GameObjects.Text;
// private targetPoint: {x:number,y:number} | null = null;
// private npcMovementStarted = false;

  constructor(){
    super("GameScene");
  }

  init(data:{character:"male"|"female",onEnterBuilding:(id:string)=>void}){

    this.characterType=data.character;
    this.onEnterBuilding=data.onEnterBuilding;

  }

  preload(){

    // CAR SPRITE
    this.load.image("car","/assets/car.png");
    this.load.audio("bgMusic", "/assets/music.mp3");

    const g=this.add.graphics();

    const drawAvatar=(skin:number,shirt:number,pants:number,key:string)=>{

      g.clear();

      g.fillStyle(skin);
      g.fillCircle(16,12,10);

      g.fillStyle(shirt);
      g.fillRoundedRect(8,24,16,20,4);

      g.fillStyle(skin);
      g.fillRoundedRect(2,26,6,16,3);
      g.fillRoundedRect(24,26,6,16,3);

      g.fillStyle(pants);
      g.fillRoundedRect(10,44,6,16,2);
      g.fillRoundedRect(16,44,6,16,2);

      g.generateTexture(key,32,64);

    };

    drawAvatar(0xffddc1,0x3b82f6,0x1e293b,"player-male");
    drawAvatar(0xffddc1,0xec4899,0x1e293b,"player-female");

  }

  create(){

    this.physics.world.setBounds(0,0,2000,2000);

    // BACKGROUND
    this.add.rectangle(1000,1000,2000,2000,0xEEF2F7);

    const g=this.add.graphics();

    // ROADS
    g.fillStyle(0x6b7280);
    g.fillRect(0,900,2000,200);
    g.fillRect(900,0,200,2000);

    // SIDEWALKS
    g.fillStyle(0xd1d5db);
    g.fillRect(0,860,2000,40);
    g.fillRect(0,1100,2000,40);
    g.fillRect(860,0,40,2000);
    g.fillRect(1100,0,40,2000);

    // ROAD LINES
    g.lineStyle(4,0xfacc15);

    for(let i=0;i<2000;i+=40){

      g.beginPath();
      g.moveTo(i,1000);
      g.lineTo(i+20,1000);
      g.strokePath();

      g.beginPath();
      g.moveTo(1000,i);
      g.lineTo(1000,i+20);
      g.strokePath();

    }

    // BUILDINGS
    // BUILDINGS
const buildingData=[

  {id:"about",name:"🏠 About",x:600,y:600,color:0xbfdbfe,type:"house"},
  {id:"education",name:"🎓 Education",x:1400,y:600,color:0xe9d5ff,type:"school"},
  {id:"projects",name:"💻 Projects",x:600,y:1400,color:0xa7f3d0,type:"lab"},
  {id:"skills",name:"⚙️ Skills",x:1400,y:1400,color:0xfde68a,type:"factory"},
  {id:"experience",name:"🏢 Experience",x:400,y:1000,color:0xfecaca,type:"office"},
  {id:"contact",name:"📞 Contact",x:1600,y:1000,color:0xfbcfe8,type:"booth"},
  {id:"resume",name:"📄 Resume",x:1000,y:1600,color:0xdbeafe,type:"library"}

];

const screenScale = window.innerWidth < 768 ? 0.8 : 1;

const b=this.add.graphics();
b.setDepth(10);

buildingData.forEach(data=>{

  const w=160 * screenScale;
  const h=120 * screenScale;

  // SHADOW
  b.fillStyle(0x000000,0.2);
  b.fillRect(data.x-w/2+10,data.y-h/2+10,w,h);

  // BUILDING BODY
  b.fillStyle(data.color);
  b.fillRect(data.x-w/2,data.y-h/2,w,h);

  // DIFFERENT BUILDING TYPES
// ABOUT HOUSE
if(data.type==="house"){

  b.fillStyle(0xef4444);

  b.fillTriangle(
    data.x-w/2-10,
    data.y-h/2,
    data.x+w/2+10,
    data.y-h/2,
    data.x,
    data.y-h/2-70
  );

}


// EDUCATION SCHOOL
if(data.type==="school"){

  b.fillStyle(0x8b5cf6);

  b.fillTriangle(
    data.x-w/2,
    data.y-h/2,
    data.x+w/2,
    data.y-h/2,
    data.x,
    data.y-h/2-50
  );

  b.fillStyle(0xffffff);

  b.fillRect(data.x-10,data.y-h/2-20,20,20);

}


// PROJECT LAB
if(data.type==="lab"){

  b.fillStyle(0x22c55e);

  b.fillRoundedRect(
    data.x-w/2,
    data.y-h/2,
    w,
    h,
    20
  );

  b.fillStyle(0x166534);

  b.fillCircle(data.x,data.y-30,10);

}


// SKILLS FACTORY
if(data.type==="factory"){

  b.fillStyle(0x6b7280);

  b.fillRect(
    data.x-w/2,
    data.y-h/2,
    w,
    h
  );

  // chimney
  b.fillRect(data.x+50,data.y-h/2-60,20,60);

}


// EXPERIENCE OFFICE
if(data.type==="office"){

  b.fillStyle(0x93c5fd);

  b.fillRoundedRect(
    data.x-w/2,
    data.y-h/2,
    w,
    h,
    10
  );

  b.fillStyle(0x1e40af);

  for(let i=-40;i<=40;i+=40){

    b.fillRect(data.x+i,data.y-30,20,20);

  }

}


// CONTACT BOOTH
if(data.type==="booth"){

  b.fillStyle(0xdb2777);

  b.fillRoundedRect(
    data.x-w/2,
    data.y-h/2,
    w,
    h,
    30
  );

  b.fillStyle(0xffffff);

  b.fillRect(data.x-20,data.y-20,40,40);

}


// RESUME LIBRARY
if(data.type==="library"){

  b.fillStyle(0x2563eb);

  b.fillTriangle(
    data.x-w/2,
    data.y-h/2,
    data.x+w/2,
    data.y-h/2,
    data.x,
    data.y-h/2-60
  );

  b.fillStyle(0x1e3a8a);

  b.fillRect(data.x-w/2,data.y-h/2,w,h);

}
  // if(data.type==="house"){

  //   b.fillStyle(0xef4444);
  //   b.fillTriangle(
  //     data.x-w/2-10,
  //     data.y-h/2,
  //     data.x+w/2+10,
  //     data.y-h/2,
  //     data.x,
  //     data.y-h/2-60
  //   );

  // }

  // if(data.type==="office"){

  //   b.fillStyle(0x93c5fd);

  //   for(let i=-40;i<=40;i+=40){
  //     b.fillRect(data.x+i,data.y-30,20,20);
  //   }

  // }

  // if(data.type==="factory"){

  //   b.fillStyle(0x6b7280);
  //   b.fillRect(data.x+40,data.y-h/2-40,20,40);

  // }

  // if(data.type==="lab"){

  //   b.fillStyle(0x22c55e);

  //   b.fillRect(data.x-40,data.y-30,20,20);
  //   b.fillRect(data.x,data.y-30,20,20);
  //   b.fillRect(data.x+40,data.y-30,20,20);

  // }

  // if(data.type==="library"){

  //   b.fillStyle(0x1e3a8a);
  //   b.fillRect(data.x-30,data.y-30,10,40);

  //   b.fillStyle(0x2563eb);
  //   b.fillRect(data.x-10,data.y-30,10,40);

  //   b.fillStyle(0x3b82f6);
  //   b.fillRect(data.x+10,data.y-30,10,40);

  // }

  // if(data.type==="booth"){

  //   b.fillStyle(0xdb2777);
  //   b.fillRect(data.x-w/2,data.y-h/2,w,20);

  // }

  // DOOR
  b.fillStyle(0x374151);
  b.fillRect(data.x-15,data.y+20,30,40);

  // COLLISION BOX
  const rect=this.add.rectangle(data.x,data.y,w,h,0,0);
  this.physics.add.existing(rect,true);

  rect.setDepth(20);

  const label=this.add.text(data.x,data.y-80,data.name,{
    fontSize:"16px",
    color:"#111827",
    backgroundColor:"#ffffffcc",
    padding:{x:8,y:4}
  })
  .setOrigin(0.5)
  .setDepth(100);

  this.buildings.push({sprite:rect,id:data.id});

});

    // PLAYER
    const texture=this.characterType==="male"?"player-male":"player-female";

    this.player=this.physics.add.sprite(900,900,texture);
    this.player.setCollideWorldBounds(true);
    this.player.setDepth(30);

    this.buildings.forEach(b=>{
      this.physics.add.collider(this.player,b.sprite);
    });

    // INPUT
    this.cursors=this.input.keyboard!.createCursorKeys();
    this.wasd=this.input.keyboard!.addKeys("W,A,S,D");
    this.interactKey=this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.E);

    // CAMERA
    this.cameras.main.startFollow(this.player,true,0.1,0.1);
    this.cameras.main.setBounds(0,0,2000,2000);
  const screenWidth = this.scale.width;

if(screenWidth < 500){
  this.cameras.main.setZoom(0.7);
}else if(screenWidth < 900){
  this.cameras.main.setZoom(1);
}else{
  this.cameras.main.setZoom(1.3);
}

    // INTERACTION TEXT
    this.interactionText=this.add.text(0,0,"Press E to Enter",{
  fontSize:"14px",
  backgroundColor:"#2563eb",
  color:"#ffffff",
  padding:{x:8,y:4}
})
.setOrigin(0.5)
.setVisible(false)
.setDepth(1000);

    // NPCs
    const npcMessages=[
      "Welcome to Hitesh World!",
      "Check out the Projects Lab!",
      "Experience Office shows real work!",
      "Skills Factory shows technologies used.",
      "Download the resume too!"
    ];

    

    npcMessages.forEach(msg=>{

      const x=Phaser.Math.Between(700,1300);
      const y=Phaser.Math.Between(700,1300);

      const npc=this.physics.add.sprite(x,y,"player-male");
      npc.setTint(0x8b5cf6);

      

      const text=this.add.text(x,y-40,msg,{
        fontSize:"12px",
        color:"#111827",
        backgroundColor:"#ffffffcc",
        padding:{x:6,y:4}
      }).setOrigin(0.5).setVisible(false);

      this.npcs.push({sprite:npc,text});

      

     npc.setVelocity(0,0);

// wait 2 seconds before NPC starts walking
// this.time.delayedCall(2000, () => {

//   this.time.addEvent({
//     delay:3000,
//     loop:true,
//     callback:()=>{

//       npc.setVelocity(
//         Phaser.Math.Between(-1,1)*80,
//         Phaser.Math.Between(-1,1)*80
//       );

//     }
//   });

// });

    });

    // PEDESTRIANS

for(let i=0;i<5;i++){

  const x = Phaser.Math.Between(200,1800);
  const y = Phaser.Math.Between(200,1800);

  const ped = this.physics.add.sprite(x,y,"player-male");

  ped.setScale(0.8);
  ped.setTint(0x22c55e);

  this.pedestrians.push(ped);

  this.time.addEvent({

    delay:3000,
    loop:true,

    callback:()=>{

      ped.setVelocity(
        Phaser.Math.Between(-1,1)*60,
        Phaser.Math.Between(-1,1)*60
      );

    }

  });

}

    

    // CARS (horizontal road)

for(let i=0;i<4;i++){

  const car=this.physics.add.sprite(-600*i,970,"car");

  car.setScale(0.08);
  car.setDepth(5);

  this.horizontalCars.push(car);
  this.cars.push(car);

}

    // CARS (vertical road)

for(let i=0;i<3;i++){

  const car=this.physics.add.sprite(1030,-600*i,"car");

  car.setScale(0.08);
  car.setAngle(90);
  car.setDepth(5);

  this.verticalCars.push(car);
  this.cars.push(car);

}

// PARK AREA
const park = this.add.graphics();

park.fillStyle(0xbbf7d0);

park.fillRect(0,0,700,700);
park.fillRect(1300,1300,700,700);


// TREES
const trees = this.add.graphics().setDepth(5);

for(let i=0;i<25;i++){

  const x = Phaser.Math.Between(50,1950);
  const y = Phaser.Math.Between(50,1950);

  // avoid road area
  if((x>850 && x<1150) || (y>850 && y<1150)) continue;

  // leaves
  trees.fillStyle(0x16a34a);
  trees.fillCircle(x,y,20);

  // trunk
  trees.fillStyle(0x78350f);
  trees.fillRect(x-4,y+20,8,10);

}
    // MINIMAP

const miniSize = window.innerWidth < 768 ? 120 : 200;

this.miniMap = this.cameras.add(
  this.scale.width - miniSize - 20,
  20,
  miniSize,
  miniSize
);

this.miniMap.setZoom(0.1);
this.miniMap.startFollow(this.player);
this.miniMap.setBackgroundColor(0x000000);
this.miniMap.setScroll(0,0);


this.time.delayedCall(100, () => {
  this.npcMovementStarted = true;
});

// MOBILE JOYSTICK
if (this.sys.game.device.os.android || this.sys.game.device.os.iOS) {

  this.joystick = new VirtualJoystick(this, {
    x: 120,
    y: this.scale.height - 120,
    radius: 60,
    base: this.add.circle(0, 0, 60, 0x000000, 0.3),
    thumb: this.add.circle(0, 0, 30, 0xffffff, 0.8),
    dir: "8dir",
    forceMin: 16
  });

}

// MOBILE INTERACT BUTTON
if (this.sys.game.device.os.android || this.sys.game.device.os.iOS) {

  this.interactButton = this.add.text(
    this.scale.width - 80,
    this.scale.height - 80,
    "E",
    {
      fontSize: "28px",
      backgroundColor: "#2563eb",
      color: "#ffffff",
      padding: {x:15,y:10}
    }
  )
  .setOrigin(0.5)
  .setScrollFactor(0)
  .setDepth(100)
  .setInteractive();

  this.interactButton.on("pointerdown", () => {

    if(this.currentBuilding){
      this.onEnterBuilding(this.currentBuilding);
    }

  });

}

const music = this.sound.add("bgMusic", {
  loop: true,
  volume: 0.3
});

music.play();

// // TAP TO MOVE
// this.input.on("pointerdown", (pointer:Phaser.Input.Pointer)=>{

//   const worldPoint = pointer.positionToCamera(this.cameras.main) as Phaser.Math.Vector2;

//   this.targetPoint = {
//     x: worldPoint.x,
//     y: worldPoint.y
//   };

// });

  }

  update(){

    const speed=300;

    // CAR LOOP

    // HORIZONTAL TRAFFIC
if(this.trafficTurn==="horizontal"){

  this.horizontalCars.forEach((car,index)=>{

    car.setVelocityX(200);

    if(car.x>2200){

      car.x=-600;

      if(index===this.horizontalCars.length-1){
        this.trafficTurn="vertical";
      }

    }

  });

  this.verticalCars.forEach(car=>{
    car.setVelocityY(0);
  });

}
else{

  this.verticalCars.forEach((car,index)=>{

    car.setVelocityY(200);

    if(car.y>2200){

      car.y=-600;

      if(index===this.verticalCars.length-1){
        this.trafficTurn="horizontal";
      }

    }

  });

  this.horizontalCars.forEach(car=>{
    car.setVelocityX(0);
  });

}

    
    this.player.setVelocity(0);

    if(this.cursors.left.isDown||this.wasd.A.isDown){
      this.player.setVelocityX(-speed);
    }
    else if(this.cursors.right.isDown||this.wasd.D.isDown){
      this.player.setVelocityX(speed);
    }

    if(this.cursors.up.isDown||this.wasd.W.isDown){
      this.player.setVelocityY(-speed);
    }
    else if(this.cursors.down.isDown||this.wasd.S.isDown){
      this.player.setVelocityY(speed);
    }

    // BUILDING INTERACTION

    let near=false;
    this.currentBuilding=null;

    for(const b of this.buildings){

      const dist=Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        b.sprite.x,
        b.sprite.y
      );

      if(dist<150){

        near=true;
        this.currentBuilding=b.id;

        this.interactionText.setPosition(b.sprite.x,b.sprite.y+80);
        this.interactionText.setVisible(true);

        break;

      }

    }

    if(!near){
      this.interactionText.setVisible(false);
    }

    if(Phaser.Input.Keyboard.JustDown(this.interactKey)&&this.currentBuilding){
      this.onEnterBuilding(this.currentBuilding);
    }

    // NPC TEXT

    this.npcs.forEach(npc=>{

      const dist=Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        npc.sprite.x,
        npc.sprite.y
      );

      if(dist<120){

        npc.text.setPosition(npc.sprite.x,npc.sprite.y-50);
        npc.text.setVisible(true);

      }else{

        npc.text.setVisible(false);

      }

    });

    if(this.npcMovementStarted){

  this.npcs.forEach(npc=>{

    if(Phaser.Math.Between(0,100)<2){

      npc.sprite.setVelocity(
        Phaser.Math.Between(-1,1)*80,
        Phaser.Math.Between(-1,1)*80
      );

    }

  });

  // JOYSTICK MOVEMENT
if (this.joystick) {

  const cursorKeys = this.joystick.createCursorKeys();

  if (cursorKeys.left.isDown) {
    this.player.setVelocityX(-speed);
  }
  else if (cursorKeys.right.isDown) {
    this.player.setVelocityX(speed);
  }

  if (cursorKeys.up.isDown) {
    this.player.setVelocityY(-speed);
  }
  else if (cursorKeys.down.isDown) {
    this.player.setVelocityY(speed);
  }

}

// TAP MOVEMENT
// if(this.targetPoint){

//   const dist = Phaser.Math.Distance.Between(
//     this.player.x,
//     this.player.y,
//     this.targetPoint.x,
//     this.targetPoint.y
//   );

//   if(dist > 10){

//     this.physics.moveTo(
//       this.player,
//       this.targetPoint.x,
//       this.targetPoint.y,
//       speed
//     );

//   }else{

//     this.player.setVelocity(0);
//     this.targetPoint = null;

//   }

// }

}

  }

}