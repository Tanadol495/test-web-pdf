let imageCounter = 0;
let savedSignatures = [];
let selectedImage = null;


async function GetPDFShow() {
    const pdfUrl = 'http://127.0.0.1:5500//public/file/Doc3.pdf'; // เปลี่ยน URL ตามที่ต้องการ
    const pdfjsLib = window['pdfjs-dist/build/pdf'];

    try {
        // ดึงข้อมูล PDF จาก URL
        const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
        console.log('pdf :>> ', pdf);

        const pdfContainer = document.getElementById('pdf-container');
        pdfContainer.innerHTML = '';

        const imageTabs = document.getElementById('imageTabs');
        imageTabs.innerHTML = '';

        let pagePositions = []; // เก็บตำแหน่ง y ของแต่ละหน้า

        for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
            const page = await pdf.getPage(pageNumber);
            const scale = 3;
            const viewport = page.getViewport({ scale: scale });

            const div = document.createElement('div');
            div.id = `page-${pageNumber}`;
            div.className = 'pdf-page'; // เพิ่มคลาสสำหรับหน้า PDF
            div.style.display = 'block';

            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            canvas.style.width = '100%'; // ขยายขนาด canvas ตามคอนเทนเนอร์
            canvas.style.height = 'auto';
    
            const renderContext = {
                canvasContext: context,
                viewport: viewport
            };

            div.appendChild(canvas);
            document.getElementById('pdf-container').appendChild(div);

            await page.render(renderContext).promise;

            const tab = document.createElement('div');
            tab.className = 'image-tab';
            tab.dataset.pageNumber = pageNumber; // เก็บหมายเลขหน้าใน dataset
            tab.style.width = '140px';
            tab.style.height = 'auto';
            tab.style.marginLeft = 'auto';
            tab.style.marginRight = 'auto';
            tab.style.border = '2px solid #d1d1d1';
            tab.style.cursor = 'pointer';
            tab.style.display = 'block';
            tab.addEventListener('click', function () {
                pdfContainer.scrollTop = pagePositions[pageNumber - 1];
                document.querySelectorAll('.image-tab').forEach(tab => tab.classList.remove('selected-tab'));
                this.classList.add('selected-tab');
            });

            const tabImage = document.createElement('img');
            tabImage.src = canvas.toDataURL();
            tabImage.alt = `Page ${pageNumber}`;
            tabImage.style.width = '100%';
            tab.appendChild(tabImage);

            const tabLabel = document.createElement('div');
            tabLabel.textContent = ` ${pageNumber}`;
            tabLabel.style.textAlign = 'center';
            // tabLabel.style.color='#19456B'
            // tabLabel.style.fontWeight="bold"
            tab.appendChild(tabLabel);

            imageTabs.appendChild(tab);

            div.appendChild(canvas);
            pdfContainer.appendChild(div);

            if (pageNumber === 1) {
                tab.classList.add('selected-tab');
            }

            const tabHeight = tab.offsetHeight;
            pagePositions.push(div.offsetTop - tabHeight);
        }

        $("#pdf-container").css({
            "overflow-x": "hidden",
            "width": "100%", // ใช้ขนาดเต็มที่
            "max-width": "100%",
            "height": "auto", // ปรับขนาดตามเนื้อหาด้านใน
        });

        pdfContainer.addEventListener('scroll', function () {
            for (let i = 0; i < pagePositions.length; i++) {
                let mapScroll = pdfContainer.scrollTop + 50;
                if (mapScroll >= pagePositions[i] && (i === pagePositions.length - 1 || mapScroll < pagePositions[i + 1])) {
                    document.querySelectorAll('.image-tab').forEach(tab => tab.classList.remove('selected-tab'));
                    const selectedTab = document.querySelector(`.image-tab[data-page-number="${i + 1}"]`);
                    if (selectedTab) {
                        selectedTab.classList.add('selected-tab');
                    }
                    break;
                }
            }
        });

    } catch (error) {
        console.error('Error loading PDF:', error);
    }
}

function importText() {
    const text = "Hello"; // ข้อความที่ต้องการ
    // Create a canvas to render the text
    const canvas = document.createElement('canvas');
    canvas.width = 400; // เพิ่มความกว้าง
    canvas.height = 200; // เพิ่มความสูง
    const context = canvas.getContext('2d');

    // Set font and size for the text
    context.font = "30px Arial";

    // Set text color
    context.fillStyle = "black";

    // Draw text on canvas (text will be converted into PNG)
    context.fillText(text, 50, 50);

    // Create an image element for the text (as PNG)
    const textImage = new Image();
    textImage.src = canvas.toDataURL(); // Convert canvas (text only) to PNG
    textImage.draggable = true; // ทำให้ภาพสามารถลากได้

    textImage.onload = function () {
        let wrapper = document.createElement('div');
        wrapper.className = 'signature-wrapper';

        // Append the text (as PNG) to the wrapper
        wrapper.appendChild(textImage);

        // Append the wrapper (containing text) to .saved-signatures
        // document.querySelector('.saved-signatures').appendChild(wrapper);
    };
}


// function importImage(imageUrl) {
//     // ใช้ fetch เพื่อนำเข้าภาพจาก URL
//     fetch(imageUrl)
//         .then(response => {
//             // ตรวจสอบว่า Response เป็น Ok หรือไม่
//             return response.blob(); // แปลง Response เป็น Blob
//         })
//         .then(blob => {
//             // สร้างไฟล์จาก Blob
//             const file = new File([blob], 'imageSteam.png', { type: blob.type }); // ตั้งชื่อไฟล์และประเภท

//             // สร้าง Image element สำหรับแสดงภาพ
//             const savedImg = new Image();
//             const reader = new FileReader();
            
//             // อ่านไฟล์เป็น data URL
//             reader.onload = function (e) {
//                 savedImg.src = e.target.result; // ใช้ผลลัพธ์จาก FileReader
//                 savedImg.draggable = true; // ทำให้ภาพสามารถลากได้

//                 savedImg.ondragstart = function (event) {
//                     event.dataTransfer.setData('text/plain', savedImg.src); // ตั้งค่า dataTransfer สำหรับลากภาพ
//                 };

//                 // เมื่อภาพถูกโหลด ให้เพิ่มไปที่ wrapper
//                 let wrapper = document.createElement('div');
//                 wrapper.className = 'signature-wrapper';
//                 wrapper.appendChild(savedImg);
                
//                 // Append the wrapper (containing image) to .saved-signatures
//                 document.querySelector('.saved-signatures').appendChild(wrapper);
//             };

//             // อ่านไฟล์
//             reader.readAsDataURL(file);
//         })
//         .catch(error => {
//             console.error('Error fetching the image:', error);
//         });
// }

// function importTextAndImage() {
//     const imageUrl = "http://localhost:5500/public/image/imageSteam.png"; // URL ของภาพ

//     // importText(); // เรียกใช้ฟังก์ชัน importText
//     importImage(imageUrl); // เรียกใช้ฟังก์ชัน importImage
// }

// function selectImage(imageElement) {
//     // ลบคลาสที่เคยเลือกก่อนหน้านี้
//     document.querySelectorAll('.saved-signatures img').forEach(img => {
//         img.classList.remove('selected');
//     });

//     // เพิ่มคลาส selected ไปยังรูปที่คลิก
//     imageElement.classList.add('selected');
//     selectedImage = imageElement.src; // เก็บ URL ของรูปที่เลือก
// }


// function preventDefaults(e) {
//     e.preventDefault();
//     e.stopPropagation();
// }

// function handleDrop(e) {
//     preventDefaults(e);
//     var dt = e.dataTransfer;
//     var files = dt.files;
//     console.log('files :>> ', files);

//     const pdfData = 'http://localhost:5500/public/file/A4-1.pdf'; 
//     const pdfjsLib = window['pdfjs-dist/build/pdf'];
//     const pdfContainer = document.getElementById('pdf-container');
//     const scrollPosition = pdfContainer.scrollTop + pdfContainer.clientHeight / 2;

//     // const pdf = pdfjsLib.getDocument(pdfUrl).promise;

//     pdfjsLib.getDocument(pdfData).promise.then(pdf => {
//         let pageNumber = 1;

//         for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
//             const container = document.getElementById('page-' + pageNum);
//             if (container) {
//                 if (scrollPosition >= container.offsetTop && scrollPosition <= container.offsetTop + container.clientHeight) {
//                     pageNumber = pageNum;
//                     break;
//                 }
//             }
//         }

//         // ตรวจสอบว่ามีไฟล์ที่ลากเข้ามาหรือไม่
        
//             handleFiles(files, pageNumber);
      
//     });
// }

function handleFiles(files, pageNumber) {
    if (files.length > 0) {
        var file = files[0];
        if (file.type.startsWith('image/')) {
            var reader = new FileReader();
            reader.onload = function(e) {
                var img = new Image();
                img.onload = function() {
                    // กำหนดตำแหน่งและขนาดของรูปภาพที่ต้องการ
                    // Optionally, set the size and position of the image
                    img.style.position = 'absolute';
                    img.style.left = '0px'; // ตำแหน่ง x
                    img.style.top = '0px'; // ตำแหน่ง y
                    img.style.width = img.width
                    img.style.height = img.height 

                    // Set a unique id for the img element
                    let imageId = `image-${imageCounter}`;
                    img.id = imageId;
                    img.className = 'resize-drag';
                    
                    imageCounter++; // Increment the counter for the next image
    
                    // Append the img element to the container holding the canvas of the specified page
                    let container = document.getElementById(`page-${pageNumber}`);
                        container.style.position = 'relative';
                        container.appendChild(img);

                    // เลือก container ที่ต้องการเพิ่มรูปภาพ
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    }
}

// function addImageToPage(imageSrc, pageNumber) {
//     var img = new Image();
//     img.onload = function() {
//         img.style.position = 'absolute';
//         img.style.left = '0px';
//         img.style.top = '0px';
//         img.style.width = img.width / 2 + 'px'; // กำหนดความกว้างของภาพ
//         img.style.height = img.height / 2 + 'px'; // กำหนดความสูงของภาพ
        
//         let container = document.getElementById(`page-${pageNumber}`);
//         container.style.position = 'relative';
//         container.appendChild(img);
//     };
//     img.src = imageSrc; // กำหนด source ของภาพที่ต้องการเพิ่ม
// }


// function addImageSelectListeners() {
//     document.querySelectorAll('.saved-signatures img').forEach(img => {
//         // เมื่อคลิกที่รูป จะเรียกใช้ selectImage
//         img.addEventListener('click', function() {
//             selectImage(this); // ส่ง element ของภาพที่คลิกเข้าไปใน selectImage
//         });
//     });
// }


function dragMoveListener(event) {
    var target = event.target
    // keep the dragged position in the data-x/data-y attributes
    var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
    var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy

    // translate the element
    target.style.transform = 'translate(' + x + 'px, ' + y + 'px)'

    // update the posiion attributes
    target.setAttribute('data-x', x)
    target.setAttribute('data-y', y)
}

$(document).ready(function () {
    GetPDFShow()
    // importTextAndImage()
    let imageId = null;

    const {
        PDFDocument
    } = PDFLib

    
        $(document).on('click', "[id^='image-']", function() {
        // เก็บ id ของ element ที่ถูกคลิก
        imageId = $(this).attr('id');

        $(".resize-drag").removeClass("selected");
        $(this).addClass("selected");

        console.log('imageId :>> ', imageId);
        
    });



    $('#download-csv').on('click', async function () {
        $(".resize-drag").removeClass("selected");
        const { PDFDocument } = PDFLib;
        const pdfDoc = await PDFDocument.create();
        const divs = document.querySelectorAll('div[id^="page-"]');
        const fileName = sessionStorage.getItem('FileName');
        const canvases = [];
        
        // แสดง SweetAlert2 เริ่มต้น
         Swal.fire({
            title: "กำลังดาวน์โหลด PDF",
            timerProgressBar: true,
            html: "<div>กรุณารอสักครู่...<b>0%</b></div>",
            didOpen: () => {
                Swal.showLoading();
            },
        });
    
        // Convert divs to Canvas and store in array
        for (let i = 0; i < divs.length; i++) {
            const div = divs[i];
            const canvas = await html2canvas(div, {
                scale: 3,
            });
            canvases.push(canvas);
    
            // Update progress after each canvas is processed
            const progress = Math.round(((i + 1) / divs.length) * 100);
            Swal.getPopup().querySelector('b').textContent = `${progress}%`;
        }
    
        // Add Canvas to PDF
        for (let i = 0; i < canvases.length; i++) {
            const canvas = canvases[i];
            const imgDataUrl = canvas.toDataURL('image/png', 1); // High quality
            const pageWidth = canvas.width;
            const pageHeight = canvas.height;
            const page = pdfDoc.addPage([pageWidth, pageHeight]);
    
            const imgData = await fetch(imgDataUrl).then(res => res.arrayBuffer());
            const img = await pdfDoc.embedPng(imgData);
    
            // Draw image on PDF page
            page.drawImage(img, {
                x: 0,
                y: 0,
                width: pageWidth,
                height: pageHeight,
            });
    
            // // Update progress
            // const progress = Math.round(((i + 1) / canvases.length) * 100);
            // // Update SweetAlert2 with progress
            // Swal.getPopup().querySelector("b").textContent = `Progress: ${progress}%`;
        }
    
        // Save PDF and download
        const pdfBytes = await pdfDoc.save();
        download(pdfBytes, fileName, "application/pdf");
    
        // Hide SweetAlert2 when done
        Swal.fire({
            title: 'ดาวน์โหลดสำเร็จ',
            icon: 'success',
            confirmButtonText: 'OK'
        }).then(() => {
            // sessionStorage.removeItem('uploadedPDF');
            // sessionStorage.removeItem('FileName');
    
            // window.location.href = 'http://localhost:5000/';
        });
    });

    $(document).on('click', "#addButton", function() {

        // สร้างข้อความ "Hello" ในรูปแบบภาพ
        const canvas = document.createElement('canvas');
        canvas.width = 200;
        canvas.height = 100;
        const context = canvas.getContext('2d');
    
        // Set font and size for the text
        context.font = "30px Arial";
        context.fillStyle = "black";
        context.fillText("Hello", 50, 50);
    
        // แปลงข้อความใน canvas ให้เป็น image URL
        const imageUrl = canvas.toDataURL();
    
        // แปลง image URL เป็น blob แล้วส่งไปยัง handleFiles
        fetch(imageUrl)
            .then(response => response.blob())
            .then(blob => {
                const file = new File([blob], 'textImage.png', { type: blob.type });
                const files = [file];
    
                // กำหนดตำแหน่งการเพิ่มรูป (หน้าที่กำหนด)
                const pdfData = 'http://127.0.0.1:5500//public/file/Doc3.pdf'; 
                const pdfjsLib = window['pdfjs-dist/build/pdf'];
                const pdfContainer = document.getElementById('pdf-container');
                const scrollPosition = pdfContainer.scrollTop + pdfContainer.clientHeight / 2;
    
                pdfjsLib.getDocument(pdfData).promise.then(pdf => {
                    let pageNumber = 1;
                    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                        const container = document.getElementById('page-' + pageNum);
                        if (container) {
                            if (scrollPosition >= container.offsetTop && scrollPosition <= container.offsetTop + container.clientHeight) {
                                pageNumber = pageNum;
                                break;
                            }
                        }
                    }
    
                    // ส่งค่าไปยังฟังก์ชัน handleFiles
                    handleFiles(files, pageNumber);
                });
            });
    });


        //* Delete Image Click Backspace 
        $(document).keydown(function(event) {
            // ตรวจสอบว่าปุ่ม Delete หรือ Backspace ถูกกด
            if (event.key === 'Delete' || event.key === 'Backspace') {
                if (imageId) {
                    // ลบภาพที่มี id ที่ตรงกับ imageId
                    $('#' + imageId).remove();
                    // ล้างค่า imageId หลังจากลบ
                    imageId = null;
                }
            }
    
    
        });
    
        //* Delete Image Click Image Delete
        $(document).on('click', "#imageDelete", function() {
            // เก็บ id ของ element ที่ถูกคลิก
            if (imageId) {
                // ลบภาพที่มี id ที่ตรงกับ imageId
                $('#' + imageId).remove();
                // ล้างค่า imageId หลังจากลบ
                imageId = null;
            }
        });

        $(document).on('click', 'canvas', function() {
      
            $(".resize-drag").removeClass('selected');
            imageId = null;
        })

    
        //*---------------------------------------- Setting Drag Move ----------------------------------------*
        // var dropArea = document.getElementById('pdf-container');

        // ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        //     dropArea.addEventListener(eventName, preventDefaults, false);
        // });
    
        // // เพิ่มอีเวนต์เพื่อเปลี่ยนรูปแบบเมื่อมีการลากไฟล์เข้ามาในพื้นที่ drop-area
        // ['dragenter', 'dragover'].forEach(eventName => {
        //     dropArea.addEventListener(eventName, () => {
        //         dropArea.style.backgroundColor = '#f0f0f0';
        //     }, false);
        // });
    
        // ['dragleave', 'drop'].forEach(eventName => {
        //     dropArea.addEventListener(eventName, () => {
        //         dropArea.style.backgroundColor = '';
        //     }, false);
        // });
    
        // // อีเวนต์สำหรับการปล่อยไฟล์ลงใน drop-area
        // dropArea.addEventListener('drop', handleDrop, false);
    
        interact('.resize-drag')
            // .resizable({
            //     // resize from all edges and corners
            //     edges: {
            //         left: true,
            //         right: true,
            //         bottom: true,
            //         top: true
            //     },
    
            //     listeners: {
            //         move(event) {
            //             var target = event.target
            //             var x = (parseFloat(target.getAttribute('data-x')) || 0)
            //             var y = (parseFloat(target.getAttribute('data-y')) || 0)
    
            //             // update the element's style
            //             target.style.width = event.rect.width + 'px'
            //             target.style.height = event.rect.height + 'px'
    
            //             // translate when resizing from top or left edges
            //             x += event.deltaRect.left
            //             y += event.deltaRect.top
    
            //             target.style.transform = 'translate(' + x + 'px,' + y + 'px)'
    
            //             target.setAttribute('data-x', x)
            //             target.setAttribute('data-y', y)
            //             target.textContent = Math.round(event.rect.width) + '\u00D7' + Math.round(event.rect.height)
    
            //             target.classList.add('resizing')
            //         },
            //         end(event) {
            //             // Hide border when resizing ends
            //             event.target.classList.remove('resizing')
            //         }
                  
            //     },
            //     modifiers: [
            //         // keep the edges inside the parent
            //         interact.modifiers.restrictEdges({
            //             outer: 'parent'
            //         }),
    
            //         // minimum size
            //         interact.modifiers.restrictSize({
            //             min: {
            //                 width: 100,
            //                 height: 50
            //             }
            //         })
            //     ],
    
            //     inertia: true
            // })
            .draggable({
                listeners: {
                    move: window.dragMoveListener,
                    // call this function on every dragend event
                    end(event) {
                    // Hide border when dragging ends
                    event.target.classList.remove('dragging')
                    // console.log("HelloWorldddd")
                },
                start(event) {
                    // Show border when dragging starts
                    event.target.classList.add('dragging')
                }
                },
                inertia: true,
                modifiers: [
                    interact.modifiers.restrictRect({
                        restriction: 'parent',
                        endOnly: true
                    })
                ]
            })
})