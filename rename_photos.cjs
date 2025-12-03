const fs = require('fs');
const path = require('path');

// 你的照片文件夹路径
const photosDir = path.join(__dirname, 'public', 'photos');

// 检查文件夹是否存在
if (!fs.existsSync(photosDir)) {
    console.error('❌ 错误：找不到 public/photos 文件夹！');
    process.exit(1);
}

// 读取文件夹下所有文件
let files = fs.readdirSync(photosDir);

// 过滤出只有 .jpg 结尾的图片 (忽略 .gitignore 和其他文件)
let jpgFiles = files.filter(file => 
    file.toLowerCase().endsWith('.jpg') || file.toLowerCase().endsWith('.jpeg')
);

if (jpgFiles.length === 0) {
    console.log('⚠️ 文件夹里没有 jpg 图片，无需处理。');
    process.exit(0);
}

console.log(`📸 找到 ${jpgFiles.length} 张图片，开始重命名...`);

// --- 第一阶段：全部重命名为临时乱码 ---
// (为了防止 "把 2.jpg 改名为 1.jpg 时，1.jpg 已经存在" 这种冲突)
const tempFiles = [];
jpgFiles.forEach((file, index) => {
    const oldPath = path.join(photosDir, file);
    const tempName = `temp_${Date.now()}_${index}.jpg`;
    const tempPath = path.join(photosDir, tempName);
    
    fs.renameSync(oldPath, tempPath);
    tempFiles.push(tempName);
});

// --- 第二阶段：按顺序赋予新名字 ---
tempFiles.forEach((file, index) => {
    const currentPath = path.join(photosDir, file);
    let newName = '';

    if (index === 0) {
        // 第一张叫 top.jpg
        newName = 'top.jpg';
    } else {
        // 剩下的从 1 开始编号
        newName = `${index}.jpg`;
    }

    const newPath = path.join(photosDir, newName);
    fs.renameSync(currentPath, newPath);
    console.log(`✅ ${file} -> ${newName}`);
});

console.log('\n🎉 重命名完成！');
console.log(`👉 你现在有 1 张 top.jpg 和 ${tempFiles.length - 1} 张数字编号图片。`);
console.log(`⚠️ 请记得去 App.tsx 里把 TOTAL_NUMBERED_PHOTOS 改为: ${tempFiles.length - 1}`);