import {Sheet} from './sheet.js'

export class Main{
    sheets = []
    constructor(sheetcontainer){
        this.optionsdiv = document.createElement("div");
        this.optionsdiv.classList.add("options_menu")
        this.sheetcontainer = sheetcontainer
        this.sheetcontainer.appendChild(this.optionsdiv)
        this.sheetchange = document.createElement("div");
        this.sheetchange.classList.add("change_sheet");

        this.new = document.createElement("button")
        this.new.textContent="+"
        this.new.addEventListener("click",()=>this.newSheet())
        this.del = document.createElement("button")
        this.del.textContent="-"
        this.del.addEventListener("click",()=>this.delSheet())
        this.prev = document.createElement("button")
        this.prev.textContent="←"
        this.prev.addEventListener("click",()=>this.prevSheet())
        this.next = document.createElement("button")
        this.next.textContent="→"
        this.next.addEventListener("click",()=>this.nextSheet())

        this.calc = document.createElement("button")
        this.calc.textContent="Calculate"
        let maths = this.calcaggregate()
        this.sheetcontainer.appendChild(maths)
        this.calc.addEventListener("click",()=>{
            //this.calcaggregate()
            this.recalc()
            maths.style.display="flex";graphdiv.style.display="none";textdiv.style.display="none"
            
        })
        
        this.text = document.createElement("button")
        this.text.textContent="Text"
        let textdiv = this.textOptionsdiv()
        textdiv.style.display="flex"
        this.sheetcontainer.appendChild(textdiv)

        this.graph = document.createElement("button")
        this.graph.textContent="graph"
        let graphdiv = this.graphOptionsDiv()
        this.sheetcontainer.appendChild(graphdiv)

        this.text.addEventListener("click",()=>{
            textdiv.style.display="flex";graphdiv.style.display="none";maths.style.display="none"
        })

        this.graph.addEventListener("click",()=>{
            console.log(graphdiv.style.display);
            graphdiv.style.display="flex" ; textdiv.style.display="none";maths.style.display="none"
        })
        

        this.sheetTabContainer = document.createElement("div")
        this.sheetTabContainer.classList.add("sheetTabs")

        this.sheetsdiv = document.createElement("div")
        this.sheetsdiv.classList.add("sheets_Div")
        let firstSheet = document.createElement("input")
        firstSheet.classList.add("sheetTab")
        firstSheet.value="Sheet 1";
        firstSheet.setAttribute("readonly","")
        firstSheet.setAttribute("data-current","")
        firstSheet.setAttribute("data-index","0")

        firstSheet.addEventListener("click",e=>this.sheetTabClickHandler(e))
        firstSheet.addEventListener("dblclick",e=>this.sheetTabDoubleClickHandler(e))
        firstSheet.addEventListener("keydown",e=>this.sheetTabKeyHandler(e))


        this.sheetchange.appendChild(this.new)
        this.sheetchange.appendChild(this.del)
        this.sheetchange.appendChild(this.prev)
        this.sheetchange.appendChild(this.next)
        this.sheetchange.appendChild(this.sheetsdiv)
        this.sheetsdiv.appendChild(firstSheet)
        this.optionsdiv.appendChild(this.text)
        this.optionsdiv.appendChild(this.graph)
        this.optionsdiv.appendChild(this.calc)
        this.sheetcontainer.appendChild(this.sheetchange)

        let sheet_1 = new Sheet(sheetcontainer)
        this.sheets.push(sheet_1)
        this.currentsheetIndex = 0
        this.currsheet(0);
    }
    currsheet(i){
        if(i>=0){
            this.sheets?.[this.currentsheetIndex]?.containerdiv?.remove()
            // this.sheetcontainer?.[0]?.remove()
            // console.log(this.sheets[i]);
            this.sheetcontainer.appendChild(this.sheets[i].containerdiv)
            // console.log(i,this.sheets);
            this.sheets[i].canvasize();
            this.sheets[i].rows();
            this.sheets[i].headers();
            this.sheets[i].table();
            this.currentsheetIndex = Number(i)
        }
    }
    newSheet(){
        let newSheet = new Sheet(this.sheetcontainer)
        this.sheets.push(newSheet)
        this.currsheet(this.sheets.length -1)
        // console.log(this.sheets);
        let newSheetdiv = document.createElement("input")
        newSheetdiv.classList.add("sheetcontainer")
        newSheetdiv.setAttribute("readonly","")
        newSheetdiv.setAttribute("data-index",this.sheets.length-1)
        newSheetdiv.addEventListener("click",e=>this.sheetTabClickHandler(e))
        newSheetdiv.addEventListener("dblclick",e=>this.sheetTabDoubleClickHandler(e))
        newSheetdiv.addEventListener("keydown",e=>this.sheetTabKeyHandler(e))
        this.sheetsdiv.appendChild(newSheetdiv)
        let tab = this.sheetsdiv.querySelectorAll("input")
        tab[this.currentsheetIndex].click()
        for(var i=0;i<this.sheets.length;i++){
            if(![...tab].map(x=>x.value).includes(`Sheet ${i+1}`)){
                break
            }
        }
        newSheetdiv.value=`Sheet ${i+1}`;
        this.sheetsdiv.scrollTo(this.sheetsdiv.scrollWidth,0)
    }
    delSheet(){
        if (this.sheets.length>1){
            console.log(this.currentsheetIndex,"delete");
            this.sheets[this.currentsheetIndex].containerdiv.remove()
            this.sheets.splice(Number(this.currentsheetIndex),1)
            console.log(this.sheets);
            this.sheetsdiv.children[this.currentsheetIndex].remove()
            this.currsheet(this.currentsheetIndex-1)
            Array(...this.sheetsdiv.children).forEach((v,j)=>{
                // console.log(j);
                v.setAttribute("data-index",j)
            })
            this.sheetsdiv.querySelectorAll("input")[this.currentsheetIndex].click()
        }
        else{
            window.alert("There Should be atleast 1 sheet")
        }
    }
    prevSheet(){
        let tabs = this.sheetsdiv.querySelectorAll("input")
        tabs[this.currentsheetIndex].removeAttribute("data-current")
        if (this.currentsheetIndex>0){
            console.log(this.currentsheetIndex);
            this.currsheet(this.currentsheetIndex-1)
        }
        this.sheetsdiv.querySelectorAll("input")[this.currentsheetIndex].click()
    }
    nextSheet(){
        let tabs = this.sheetsdiv.querySelectorAll("input")
        tabs[this.currentsheetIndex].removeAttribute("data-current")
        if (this.currentsheetIndex<this.sheets.length-1){
            console.log(this.currentsheetIndex);
            this.currsheet(this.currentsheetIndex+1)
        }
        this.sheetsdiv.querySelectorAll("input")[this.currentsheetIndex].click()
    }
    sheetTabClickHandler(e){
        e.target.parentElement.querySelectorAll("input").forEach(t1=>{
            t1.removeAttribute("data-current")
            t1.setAttribute("readonly","")
          })
        e.target.setAttribute("data-current","true")
        this.currsheet(e.target.dataset["index"])
    }
    sheetTabDoubleClickHandler(e){
        e.target.focus();
        e.target.removeAttribute("readonly")
    }
    sheetTabKeyHandler(e){
        if(e.key==="Enter"){
              e.target.setAttribute("readonly","")
        }
    }
    // calcaggregate(){
        
    // }
    wraptextfeild(){
        // this.sheets[this.currentsheetIndex].wraptext()
        this.sheets[this.currentsheetIndex].wraprange()
        this.sheets[this.currentsheetIndex].canvasize();
        this.sheets[this.currentsheetIndex].rows();
        this.sheets[this.currentsheetIndex].headers();
        this.sheets[this.currentsheetIndex].table();
    }
    graphOptionsDiv(){
        this.graphOptions = document.createElement("div");
        this.graphOptions.classList.add("graphOptions")
        let bar = document.createElement("button")
        bar.classList.add("bar")
        bar.textContent="Bar"
        bar.addEventListener("click",()=>{
            this.sheets[this.currentsheetIndex].graph("bar")
        })
        let pie = document.createElement("button")
        pie.classList.add("pie")
        pie.addEventListener("click",()=>{
            this.sheets[this.currentsheetIndex].graph("pie")
        })
        pie.textContent="pie"
        let line = document.createElement("button")
        line.classList.add("line")
        line.textContent="Line"
        line.addEventListener("click",()=>{
            this.sheets[this.currentsheetIndex].graph("line")
        })
        let doughnut = document.createElement("button")
        doughnut.classList.add("doughnut")
        doughnut.textContent="doughnut"
        doughnut.addEventListener("click",()=>{
            this.sheets[this.currentsheetIndex].graph("doughnut")
        })
        this.graphOptions.appendChild(bar)
        this.graphOptions.appendChild(doughnut)  
        this.graphOptions.appendChild(pie)
        this.graphOptions.appendChild(line)
        
        return this.graphOptions
    }
    textOptionsdiv(){
        this.textOptions = document.createElement("div");
        this.textOptions.classList.add("textOptions");

        let wrap = document.createElement("button")
        wrap.textContent="Wrap Text"
        wrap.addEventListener("click",()=>this.sheets[this.currentsheetIndex].wraprange())

        this.textOptions.appendChild(wrap)
        return this.textOptions
    }
    
    calcaggregate(){
        this.calcOptions = document.createElement("div");
        this.calcOptions.classList.add("calcdiv");

        this.min = document.createElement("span")
        this.max = document.createElement("span")
        this.mean = document.createElement("span")
        this.sum = document.createElement("span")
        this.multiply = document.createElement("span")
        this.calcOptions.appendChild(this.min)
        this.calcOptions.appendChild(this.max)
        this.calcOptions.appendChild(this.mean)
        this.calcOptions.appendChild(this.sum)
        this.calcOptions.appendChild(this.multiply)
        return this.calcOptions
    }
    //for calculation and call from sheets
    recalc(){
        // if(!this.sheets[this.currentsheetIndex]){return}
        let val = this.sheets[this.currentsheetIndex].calculate()
        console.log(this.sheets[this.currentsheetIndex]);
        this.min.textContent="Min:"+`${val?.[0] ? val[0] : "Null"}`
        this.max.textContent="Max:"+`${val?.[1] ? val[1] : "Null"}`
        this.mean.textContent="Mean:"+`${val?.[2] ? val[2] : "Null"}`
        this.sum.textContent="Sum:"+`${val?.[3] ? val[3] : "Null"}`
        this.multiply.textContent="Multiply:"+`${val?.[4] ?val[4] : "Null"}`
    }
}