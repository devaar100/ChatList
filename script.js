const chat_names = ["Prateek Bhaiya", "Arnav Bhaiya", "Munna Bhaiya", "Aarnav Jindal", "Shriya Chhabra",  "Akul Jindal", "Abhinav Duggal"];
const chat_names_length = chat_names.length;
const chat_msg = ["Why didn't he come and talk to me himse...",
    "Perfect, I am really glad to hear that!...",
    "This is what I understand you're telling me..",
    "I’m sorry, I don’t have the info on that.."];
const chat_msg_length = chat_msg.length;
const chat_img_length = 7;

onload = function () {

    const chatlist = document.getElementById('chat-list');
    const add = document.getElementById('generate-step');
    const text = document.getElementById('temptext');

    const templates = document.getElementsByTagName('template')[0];
    const chat_item = templates.content.querySelector("li");

    const chatHandler = new ChatHandler(chat_item);
    let chats = [];

    add.onclick = function () {
        if(Math.random()>0.75 && chats.length > 0){
            let index = Math.floor(Math.random()*chats.length);
            let idToDelete = chats[index];
            chatHandler.deleteChat(idToDelete, chatlist);
            text.innerHTML = "Deleted message from "+chat_names[idToDelete] + "<br>" + text.innerHTML;
                chats.splice(index, 1);
        } else{
            let idOfMsg = Math.floor(Math.random()*7);
            if(chats.includes(idOfMsg)===false){
                chats.push(idOfMsg);
            }
            chatHandler.newMsg(idOfMsg, chatlist);
            text.innerHTML = "New message from "+chat_names[idOfMsg] + "<br>" + text.innerHTML;
        }
    };
};

class ChatHandler{
    constructor(chat_item){
        this.hashmap = new Map();
        this.linked_list = null;
        this.chat_template = chat_item;
        let clock = new Date();
        this.hours = clock.getHours();
        this.mins = clock.getMinutes();
    }

    createNode(id){
        let node = {};
        node['next'] = null;
        node['prev'] = null;
        let chat_item = this.chat_template.cloneNode(true);
        chat_item.querySelector('#Name').innerText = chat_names[id%chat_names_length];
        chat_item.querySelector('#Message').innerText = chat_msg[id%chat_msg_length];
        chat_item.querySelector('#Image').src = "./images/avatar" + eval(1+(id%chat_img_length)) + ".png";
        node['chat_item'] = chat_item;
        return node;
    }

    newMsg(id, chatlist) {
        let node = null;
        if ((id in this.hashmap) === false) {
            node = this.createNode(id);
            this.hashmap[id] = node;
        } else {
            node = this.hashmap[id];
            let prevNode = node['prev'];
            let nextNode = node['next'];
            if(prevNode!==null)
                prevNode['next'] = nextNode;
            if(nextNode!==null)
                nextNode['prev'] = prevNode;

            if(node===this.linked_list){
                this.linked_list = nextNode;
            }
            node['next'] = null;
            node['prev'] = null;
        }
        if(this.linked_list===null){
            this.linked_list = node;
        } else{
            node['next'] = this.linked_list;
            if(this.linked_list!==null)
                this.linked_list['prev'] = node;
            this.linked_list = node;
        }

        this.updateList(chatlist);
    }

    deleteChat(id, chatlist){
        let node = this.hashmap[id];
        let prevNode = node['prev'];
        let nextNode = node['next'];

        if(prevNode===null){
            this.linked_list = nextNode;
            if(this.linked_list!==null)
                this.linked_list['prev'] = null;
        } else{
            if(prevNode!==null)
                prevNode['next'] = nextNode;
            if(nextNode!==null)
                nextNode['prev'] = prevNode;
        }

        delete this.hashmap[id];

        this.updateList(chatlist);
    }

    getTime(){
        this.mins += 1;
        if(this.mins === 60){
            this.hours += 1;
            this.mins = 0;
        }

        if(this.hours === 24){
            this.hours = 0;
        }

        return ("0" + this.hours).slice(-2)+":"+("0" + this.mins).slice(-2);
    }

    updateList(chatlist){
        let innerHTML = '';
        let head = this.linked_list;
        while(head!==null){
            let element = head['chat_item'];
            if(head===this.linked_list){
                element.className = "ks-item ks-active";
                element.querySelector('#Time').innerText = this.getTime();
            } else{
                element.className = "ks-item";
            }
            innerHTML += element.outerHTML;
            head = head['next'];
        }
        chatlist.innerHTML = innerHTML;
    }
}