import Matter from 'matter-js';

// Physics engine setup for the game
export const createPhysicsEngine = (width: number, height: number) => {
  const engine = Matter.Engine.create({ enableSleeping: false });
  const world = engine.world;

  // Create boundaries
  const wallOptions = { 
    isStatic: true, 
    friction: 0, 
    restitution: 0.5,
    label: 'boundary'
  };

  const ground = Matter.Bodies.rectangle(
    width / 2,
    height + 25,
    width + 100,
    50,
    { ...wallOptions, label: 'ground' }
  );

  const leftWall = Matter.Bodies.rectangle(
    -25,
    height / 2,
    50,
    height,
    wallOptions
  );

  const rightWall = Matter.Bodies.rectangle(
    width + 25,
    height / 2,
    50,
    height,
    wallOptions
  );

  Matter.World.add(world, [ground, leftWall, rightWall]);

  return { engine, world };
};

// Create a tower body
export const createTowerBody = (
  world: Matter.World,
  x: number,
  y: number,
  width: number,
  height: number,
  label: string
) => {
  const tower = Matter.Bodies.rectangle(x, y, width, height, {
    isStatic: true,
    label,
    friction: 0.8,
    restitution: 0.1,
  });

  Matter.World.add(world, tower);
  return tower;
};

// Create a projectile body
export const createProjectileBody = (
  world: Matter.World,
  x: number,
  y: number,
  radius: number,
  velocity: { x: number; y: number },
  label: string
) => {
  const projectile = Matter.Bodies.circle(x, y, radius, {
    label,
    friction: 0,
    restitution: 0.6,
    frictionAir: 0.001,
  });

  Matter.Body.setVelocity(projectile, velocity);
  Matter.World.add(world, projectile);
  return projectile;
};

// Create tower blocks for destructible physics
export const createTowerBlocks = (
  world: Matter.World,
  baseX: number,
  baseY: number,
  blockWidth: number,
  blockHeight: number,
  rows: number,
  cols: number,
  labelPrefix: string
) => {
  const blocks: Matter.Body[] = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = baseX + col * blockWidth;
      const y = baseY - row * blockHeight;
      
      const block = Matter.Bodies.rectangle(x, y, blockWidth, blockHeight, {
        label: `${labelPrefix}-block-${row}-${col}`,
        friction: 0.8,
        restitution: 0.1,
        density: 0.002,
      });

      blocks.push(block);
      Matter.World.add(world, block);
    }
  }

  return blocks;
};

// Apply explosion force
export const applyExplosion = (
  world: Matter.World,
  bodies: Matter.Body[],
  explosionX: number,
  explosionY: number,
  force: number,
  radius: number
) => {
  bodies.forEach(body => {
    const dx = body.position.x - explosionX;
    const dy = body.position.y - explosionY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < radius) {
      const strength = (1 - distance / radius) * force;
      const angle = Math.atan2(dy, dx);
      
      Matter.Body.applyForce(body, body.position, {
        x: Math.cos(angle) * strength,
        y: Math.sin(angle) * strength,
      });
    }
  });
};

// Remove body from world
export const removeBody = (world: Matter.World, body: Matter.Body) => {
  Matter.World.remove(world, body);
};

// Update physics
export const updatePhysics = (engine: Matter.Engine, delta: number = 1000 / 60) => {
  Matter.Engine.update(engine, delta);
};
