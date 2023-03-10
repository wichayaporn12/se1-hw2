var DEBUG = true;

if(DEBUG)
{
    console.log("DEBUG ON");
}

// หากต้องการแสดงผลใน console ให้ใช้ฟังก์ชั่นนี้ 
// หากไม่ต้องการแสดงผลใน console ให้ปรับค่า DEBUG = false;
function dbg()
{
    if(DEBUG)
    {
        console.log.apply(null, arguments);
    }
}

// ตารางเดือน
var months = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฏาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"]

// ตัวแปรสำหรับเก็บค่าวันที่ถูกคลิก เดือน/ปีที่ถูกเลือก
var date = new Date();
var currentDay = -1;
var currentMonth = date.getMonth();
var currentYear = date.getFullYear(); 
var database = JSON.parse(localStorage.getItem("database")) || {};



// ตัวแปรสำหรับเก็บข้อมูลการนัดที่ถูกเพิ่ม/ลบ
// Structure คือ 
/* 
{
    "ปี-เดือน-วัน": [{"id": ไอดี, "desc": คำอธิบายนัด, "time": คำอธิบายเวลานัด}, {"id": ไอดี, "desc": คำอธิบายนัด, "time": คำอธิบายเวลานัด} ...],
    "ปี-เดือน-วัน": [{"id": ไอดี, "desc": คำอธิบายนัด, "time": คำอธิบายเวลานัด}, {"id": ไอดี, "desc": คำอธิบายนัด, "time": คำอธิบายเวลานัด} ...]
    ...
}
ตัวอย่าง
{
    "2022-0-11": [{"id": 0, "desc": "นัดเจอแฟนวันที่ 11 มกราคม", "time": "10 โมงที่เก่า"}, {"id": 1, "desc": "นัดเจอกิ๊กวันที่ 11 มกราคม", "time": "สองทุ่มที่เก่า"}],
    "2022-11-7": [{"id": 0, "desc": "นัดเจอแฟนเก่าวันที่ 7 ธันวาคม", "time": "10 โมงที่เก่า"}]
}
*/
let eStore = JSON.parse(localStorage.getItem("events")) || {};

// ฟังก์ชั่นสำหรับล้างปฏิทิน
function clearCalendar()
{
    document.getElementById("week1").innerHTML = "";
    document.getElementById("week2").innerHTML = "";
    document.getElementById("week3").innerHTML = "";
    document.getElementById("week4").innerHTML = "";
    document.getElementById("week5").innerHTML = "";
    document.getElementById("week6").innerHTML = "";

    // สังเกตดูว่ามี element ไหนอีกที่เราต้องเคลียจากตาราง แล้วเติมให้ถูกต้อง

}

// ฟังก์ชั่นสำหรับอัพเดทปฏิทิน คือ ล้างก่อน แล้วเติมข้อมูล
function updateCalendar()
{
    clearCalendar();

    document.getElementById("currentMonth").innerHTML = String(months[currentMonth]);
    document.getElementById("currentYear").innerHTML = String([currentYear]);
    // ใส่ค่าที่อัพเดทให้กับปฏิทิน

       insertCalendar();
}

function insertCalendar()
{
    var currentDay = 1;
    var dNow = new Date(currentYear, currentMonth, currentDay);
    dbg(dNow);
    maxDate = 32 - new Date(currentYear,currentMonth,32).getDate();

    for(var r=1; r<7; r++)
    {
        var row = document.getElementById("week"+String(r));

        dbg("นอก",r);
        for(var d=0; d<7 ;d++)
        {
            dbg("ใน",r,d);
            dNow = new Date(currentYear, currentMonth, currentDay);
            dbg(dNow);

            if(d == dNow.getDay() && currentDay <= maxDate)
            {
                dbg(dNow.getDay());
                const node = document.createElement("td");
                node.className = "day"; //ShowModal ตัวเลข
                node.setAttribute("onclick", "showModal("+ String(currentDay) +")");
                node.innerHTML = '<div class="date">' + String(currentDay) + '</div>';

                let key = String(currentDay) + "-" + months[currentMonth] + "-" + String(currentYear);

                if(database[key])
                {
                    for(let e of database[key])
                    {
                        node.innerHTML += `
                            <div class="event">
                                <div class="event-desc">
                                    ` + e.desc + `
                                </div>
                                <div class="event-time">
                                    ` + e.time + `
                                </div>
                            </div>
                        `;
                    }
                }
                
                row.appendChild(node);
                currentDay += 1;
            }
            else
            {
                const node = document.createElement("td");
                node.className = "day other-month";
                row.appendChild(node);
            }
        }
    }
    
}

// ฟังก์ชั่นสำหรับเลื่อนเดือนไปเดือนก่อนหน้า
function prevMonth()
{
    // ดูตัวอย่างจากฟังก์ชั่น nextMonth() อย่าลืมเช็คกรณีที่เลขที่เดือนน้อยกว่า 0 ให้วนกลับไปที่ 11
    currentMonth =(currentMonth - 1) % 12;

    if(currentMonth < 0)
    {
        currentMonth = 11;
    }

    updateCalendar();
}

// ฟังก์ชั่นสำหรับเลื่อนเดือนไปเดือนถัดไป
function nextMonth()
{
    // ตัวแปร currentMonth ควรมีค่าตั้งแต่ 0-11 (0 คือ มกราคม, 11 คือ ธันวาคม)
    // เพิ่มค่าตัวแปร currentMonth อีก 1 ถ้าเพิ่มแล้วเกิน 12 ให้วนกลับไป 0
    currentMonth = (currentMonth + 1) % 12;

    updateCalendar();
}

// ฟังก์ชั่นสำหรับเลื่อนปีไปปีก่อนหน้า
function prevYear()
{
    // ตัวแปร currentYear ควรมีค่ามากกว่า 0
    // ลบค่าตัวแปร currentYear ลงหนึ่งแล้วอัพเดทปฏิทิน
    currentYear -= 1;

    if(currentYear < 0)
    {
        currentYear = 0;
    }

    updateCalendar();
}

// ฟังก์ชั่นสำหรับเลื่อนปีไปปีถัดไป
function nextYear()
{
    // ดูตัวอย่างจากฟังก์ชั่น prevYear()
    currentYear += 1;
    updateCalendar();

}

// ฟังก์ชั่นสำหรับเซฟนัดสำหรับวันที่คลิก
function saveData()
{
    // สิ่งที่ต้องทำ loop เช็ค form ทั้งหมดใน Modal และดึงค่าที่ผู้ใช้อาจจะอัพเดทออกมา ก่อนที่จะเซฟลงไปที่ฐานข้อมูลของเรา
    // คำแนะนำ: ใช้ document.getElementsByClassName เพื่อที่จะดึงค่าของ textarea และ input ของคลาส modal-descriptions และ modal-times
    // ค่าที่ return จะเป็น array ซึ่งเราจะต้องใช้ for loop ในการเข้าถึงค่าของแต่ละตัว

    let descriptions = document.getElementsByClassName('modal-descriptions');
    let times = document.getElementsByClassName('modal-times');
    let arr = [];

    for(let i=0; i<descriptions.length; i++)
    {
        dbg(descriptions[i].value,times[i].value);
        if(descriptions[i].value != "" && times[i].value != "")
        arr.push({"desc": descriptions[i].value, "time": times[i].value});
    }
    
    let key = String(currentDay) + "-" + months[currentMonth] + "-" + String(currentYear);
    database[key] = arr;

    localStorage.setItem("database", JSON.stringify(database));
    // dbg(descriptions,times);
}

// ฟังก์ชั่นสำหรับแสดงผล Modal (รายละเอียดวันที่คลิก)
function showModal(day)
{
    let modal = document.getElementById("detail-modal");
    currentDay = day;

    modal.style.display = "block";

    document.getElementById("modal-h2").innerHTML = String(day) + " " + String(months[currentMonth]) + " " + String(currentYear);
    document.getElementById("modal-body").innerHTML = '';
        // เพิ่มค่าลงไปตามวันที่(database)
        let key = String(currentDay) + "-" + months[currentMonth] + "-" + String(currentYear);
    if(database[key] != null)
    {
        let id = 0;

        for(let arr of database[key])
        {
            dbg(arr['desc']); 

            document.getElementById("modal-body").innerHTML += `
                <div id=r-` + String(id) + ` >
                <hr>
                <textarea  class="modal-descriptions" placeholder="รายละเอียด">` + arr['desc'] + `</textarea><br>
                <input type="text" class="modal-times" placeholder="เวลา"value="` + arr['time'] + `"> 
                <span onclick="removeEvent(` + String(id) + `)"><i class="fa-regular fa-calendar-minus"></i></span><br>
                </div>
            `;
        }
    }
    document.getElementById("modal-body").innerHTML += `
    <textarea id="desc" class="modal-descriptions" placeholder="รายละเอียด"></textarea><br>
    <input type="text" id="time" class="modal-times" placeholder="เวลา"> 
    <span onclick="addEvent()"><i class="fa-regular fa-calendar-plus"></i></span><br>
    `;
}

// ฟังก์ชั่นสำหรับจัดการการกดปุ่มเพิ่มนัด
function addEvent()
{
    // ใช้ document.getElementById ดึงค่า id=desc กับ id=time ออกมา และเพิ่มเข้าไปในฐานข้อมูล รวมถึงอัพเดทหน้า Modal ให้แสดงผลนัดที่เพิ่มเข้าไป
    let desc = document.getElementById("desc").value;
    let time = document.getElementById("time").value;

    let key = String(currentDay) + "-" + months[currentMonth] + "-" + String(currentYear);
    let array = database[key] || []; 
    array.push({"desc": desc, "time": time});
    database[key] = array;
    
    localStorage.setItem("database", JSON.stringify(database));

    document.getElementById("modal-body").innerHTML = `
    <hr> 
        <textarea class="modal-descriptions" placeholder="รายละเอียด">` + desc+ `</textarea><br>
        <input type="text" class="modal-times" placeholder="เวลา"value="` + time + `"> 
        <span onclick="removeEvent()"><i class="fa-regular fa-calendar-minus"></i></span><br>
    ` + document.getElementById("modal-body").innerHTML;
}

function removeEvent(id)
{
    dbg("Remove event clicked", id);
    document.getElementById("r-" + String(id)).remove();
}

// ฟังก์ชั่นเมื่อมีการกดปิด Modal
function closeModal()
{
    let modal = document.getElementById("detail-modal");

    modal.style.display = "none";
    saveData();
    updateCalendar();
    populateSummary();
}

// ฟังก์ชั่นสำหรับใส่ข้อมูลส่วนสรุปนัดทั้งหมด
// ตอนนี้ส่วนแสดงผลได้ใช้ ordered list (<ol>) ในการแสดงผล และยังไม่มีการตกแต่งใดๆ ให้นักเรียนแก้ไขฟังก์ชั่นนี้ให้การแสดงผลสวยงาม เช่น ใส่ css ให้กับ list หรือ แก้ list ให้เป็น table หรือ element ประเภทอื่นๆ และเพิ่ม CSS ให้มัน
function populateSummary()
{
    let el = document.getElementById("event-list");
    el.innerHTML = "";

    let keys = Object.keys(database);
    
    for(let k of keys)
    {
        //dbg(k. database[k]);
        for(let l of database[k])
        {
            dbg(k, l);
            el.innerHTML += '<li>' + k + ': ' + l.desc + '@' + l.time + '</li>';
        }
    }
}