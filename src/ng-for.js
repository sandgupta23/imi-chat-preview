var arr = ["name1", "name2", "name3"];


class NgFor {

    constructor(id, arr, template){
        this._template = template;
        this.arr = arr;
        console.log(template);
        // this.render();
    }

    set arr(val){
        this._arr = val;
        this.render();
    }

    render(){
        console.log('render');
        var str = this._arr.map((item)=>{
            return this._template(item);
        }).join('');
        console.log(str);
    }

}

var ngFOr = new NgFor("id", arr, template);
ngFOr.arr = [...arr, 'name4'];
console.log('attempr 2');
ngFOr.arr = [...arr, 'name555'];

function template(name) {
    return `
        <div>${name}</div> 
    `
}


/*
*
        <div *ngFor = 'let name in ["name1", "name2"]'>{{name}}</div>
*
* */
