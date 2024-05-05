
const canvas = document.getElementById('canvas');
let w = canvas.width = 500;
let h = canvas.height = 500;
const ctx = canvas.getContext("2d");
const incBtn = document.getElementById('inc');
const decBtn = document.getElementById('dec');
let shape = 1;
//////////////////////////
const focalLength = 300;
const lSize = 100;
const theta = 2 * Math.PI / 1000;
const sinTheta = Math.sin(theta);
const cosTheta = Math.cos(theta);

let [vertex3DList, edgeTable] = getRHexahedron(lSize);
incBtn.addEventListener('click', () => {
  if (shape < 2) {
    shape++;
    getShape();
  }
});
decBtn.addEventListener('click', () => {
  if (shape > 0) {
    shape--;
    getShape();
  }
});

function getShape() {
  if (shape == 0) [vertex3DList, edgeTable] = getRTetrahedron(lSize);
  else if (shape == 1) [vertex3DList, edgeTable] = getRHexahedron(lSize);
  else[vertex3DList, edgeTable] = getROctahedron(lSize);
}


function vertex3DTo2D(v3d) {
  let v2d = [];
  v3d.forEach(v => {
    let xp = (focalLength * v[0]) / (focalLength + v[2]);
    let yp = (focalLength * v[1]) / (focalLength + v[2]);
    v2d.push([xp, yp]);
  });
  return v2d;
}

let cx = x => x + w / 2;
let cy = y => h / 2 - y;

function drawShape(v2d, edgeTable) {
  edgeTable.forEach((e) => {
    let v1 = v2d[e[0]];
    let v2 = v2d[e[1]];
    let x1 = cx(v1[0]);
    let y1 = cy(v1[1]);
    let x2 = cx(v2[0]);
    let y2 = cy(v2[1]);

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.closePath();
    ctx.stroke();
  });
}

function draw() {
  ctx.strokeStyle = 'white';
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, w, h);
  rota();
  let vertex2DList = vertex3DTo2D(vertex3DList);
  drawShape(vertex2DList, edgeTable);
  window.requestAnimationFrame(draw);
}

function rota() {
  let xrot = document.getElementById('xrot');
  let yrot = document.getElementById('yrot');
  let zrot = document.getElementById('zrot');

  vertex3DList.forEach(v => {
    let vTemp;
    if (xrot.checked) {
      vTemp = v[1];
      v[1] = (v[1] * cosTheta) - (v[2] * sinTheta);
      v[2] = (vTemp * sinTheta) + (v[2] * cosTheta);
    }
    if (yrot.checked) {
      vTemp = v[0];
      v[0] = (v[0] * cosTheta) + (v[2] * sinTheta);
      v[2] = - (vTemp * sinTheta) + (v[2] * cosTheta);
    }
    if (zrot.checked) {
      vTemp = v[0];
      v[0] = (v[0] * cosTheta) - (v[1] * sinTheta);
      v[1] = (vTemp * sinTheta) + (v[1] * cosTheta);
    }
  });
}

function getRTetrahedron(eSize) {
  const apot = (Math.sqrt(3) / 2) * eSize;
  const h = Math.sqrt(2 / 3) * eSize
  const halfE = eSize / 2;

  const vertex3DList = [
    [0, apot / 2, -h/4],                
    [-halfE, -apot / 2, -h/4],             
    [halfE, -apot / 2, -h/4],         
    [0, apot / 3 - apot / 2, h - h/4]
  ];

  const edgeTable = [
    [0, 1], [1, 2], [2, 0],
    [0, 3], [1, 3], [2, 3]
  ];
  return [vertex3DList, edgeTable];
}


function getRHexahedron(eSize) {
  let halfE = eSize / 2;
  const vertex3DList = [
    [halfE, halfE, halfE], [halfE, halfE, -halfE], [halfE, -halfE, halfE],
    [halfE, -halfE, -halfE], [-halfE, halfE, halfE], [-halfE, halfE, -halfE],
    [-halfE, -halfE, halfE], [-halfE, -halfE, -halfE]
  ];

  const edgeTable = [
    [0, 1], [0, 2], [0, 4], [1, 3],
    [1, 5], [2, 3], [2, 6], [3, 7],
    [4, 5], [4, 6], [5, 7], [6, 7]
  ];

  return [vertex3DList, edgeTable];
}

function getROctahedron(edgeSize) {
  const coord = edgeSize / Math.sqrt(2);

  const vertex3DList = [
    [coord, 0, 0], [-coord, 0, 0],
    [0, coord, 0], [0, -coord, 0],
    [0, 0, coord], [0, 0, -coord]
  ];

  const edgeTable = [
    [0, 2], [0, 3], [0, 4], [0, 5],
    [1, 2], [1, 3], [1, 4], [1, 5],
    [2, 4], [2, 5], [3, 4], [3, 5]
  ];

  return [vertex3DList, edgeTable];
}

window.requestAnimationFrame(draw);