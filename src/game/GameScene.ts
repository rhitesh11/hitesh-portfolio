import Phaser from "phaser";

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
    const buildingData=[

      {id:"about",name:"🏠 About",x:600,y:600,color:0xbfdbfe},
      {id:"education",name:"🎓 Education",x:1400,y:600,color:0xe9d5ff},
      {id:"projects",name:"💻 Projects",x:600,y:1400,color:0xa7f3d0},
      {id:"skills",name:"⚙️ Skills",x:1400,y:1400,color:0xfde68a},
      {id:"experience",name:"🏢 Experience",x:400,y:1000,color:0xfecaca},
      {id:"contact",name:"📞 Contact",x:1600,y:1000,color:0xfbcfe8},
      {id:"resume",name:"📄 Resume",x:1000,y:1600,color:0xdbeafe}

    ];

const b=this.add.graphics();
b.setDepth(10);

    buildingData.forEach(data=>{

      const w=160;
      const h=120;

      b.fillStyle(0x000000,0.15);
      b.fillRect(data.x-w/2+10,data.y-h/2+10,w,h);

      b.fillStyle(data.color);
      b.fillRect(data.x-w/2,data.y-h/2,w,h);

      b.fillStyle(0x374151);
      b.fillRect(data.x-15,data.y+20,30,40);

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

    this.player=this.physics.add.sprite(1000,1000,texture);
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
    this.cameras.main.setZoom(1.3);

    // INTERACTION TEXT
    this.interactionText=this.add.text(0,0,"Press E to Enter",{
      fontSize:"14px",
      backgroundColor:"#2563eb",
      color:"#ffffff",
      padding:{x:8,y:4}
    }).setOrigin(0.5).setVisible(false);

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

    this.miniMap=this.cameras.add(window.innerWidth-220,20,200,200);
    this.miniMap.setZoom(0.1);
    this.miniMap.startFollow(this.player);
    this.miniMap.setBackgroundColor(0x000000);


this.time.delayedCall(100, () => {
  this.npcMovementStarted = true;
});

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

}

  }

}