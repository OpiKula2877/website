const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const colorsDiv = document.getElementById('colors');


const penBtn = document.getElementById('pen');
const eraserBtn = document.getElementById('eraser');


let drawing = false;
let currentColor = '#000000';
let mode = 'pen';


const colors = [
'#000000','#7f7f7f','#c3c3c3','#ffffff','#880015','#ed1c24',
'#b97a57','#ff7f27','#ffc90e','#fff200','#efe4b0','#b5e61d',
'#22b14c','#99d9ea','#7092be','#00a2e8','#3f48cc','#a349a4',
'#ffaec9','#c8bfe7'
];


colors.forEach(color => {
const btn = document.createElement('button');
btn.dataset.color = color;
btn.style.backgroundColor = color;
btn.addEventListener('click', () => {
currentColor = color;
mode = 'pen';
});
colorsDiv.appendChild(btn);
});


penBtn.addEventListener('click', () => mode = 'pen');
eraserBtn.addEventListener('click', () => mode = 'eraser');


canvas.addEventListener('mousedown', e => {
drawing = true;
ctx.beginPath();
ctx.moveTo(e.offsetX, e.offsetY);
});


canvas.addEventListener('mousemove', e => {
if (!drawing) return;


if (mode === 'eraser') {
ctx.globalCompositeOperation = 'destination-out';
ctx.lineWidth = 20;
} else {
ctx.globalCompositeOperation = 'source-over';
ctx.strokeStyle = currentColor;
ctx.lineWidth = 2;
}


ctx.lineTo(e.offsetX, e.offsetY);
ctx.stroke();
});


canvas.addEventListener('mouseup', () => {
drawing = false;
ctx.globalCompositeOperation = 'source-over';
});


canvas.addEventListener('mouseleave', () => drawing = false);