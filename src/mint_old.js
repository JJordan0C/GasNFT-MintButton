class GasNFTMintButton extends HTMLElement {

    
    constructor() {
        super();
        var rendered = false;
        var web3 = undefined;
        let address = '';
        let abi = [];
        var connectToWeb3 = setInterval(() => {
            if (window.hasOwnProperty("Web3")) {
                this.web3 = new Web3(Web3.givenProvider);
                clearInterval(connectToWeb3);
            }
        }, 800);
        let btn = undefined;
        let showCost = false;
        let cost = 0;
        let costGwei = 0;
        let setCost = setInterval(() => {
            if (this.web3 != undefined) {
                let contract = new this.web3.eth.Contract(this.abi, this.address);
     
                contract.methods.cost().call({from: "0xe7360083C41591bd872c32979F1453022582A398"}, (err, res) => {
                    this.cost.innerHTML = this.web3.utils.fromWei(res, "ether");
                    this.costWei = res
                    clearInterval(setCost)
                })
             }
        }, 800);
        let totalSupply = setInterval(() => {
            if (this.web3 != undefined) {
                let contract = new this.web3.eth.Contract(this.abi, this.address);

                contract.methods.totalSupply().call((err, res) => {
                    clearInterval(totalSupply)
                })
            }
        }, 800);
        // element created
    }

    render() {
        this.btn = document.createElement('button');
    
        let value = this.getAttribute("title") == null ? "Mint" : this.getAttribute("title");

        this.showCost = this.getAttribute("show-cost");

        this.address = this.getAttribute("address");

        
        this.abi = this.parseJwt(this.getAttribute("abi"));
        
        this.btn.innerHTML = value;
        
        this.appendChild(this.btn);
        
        
        this.btn.classList.add(...this.classList);

        if (window.ethereum) {
            if (this.showCost) {
                this.cost = document.createElement("p");
                this.cost.innerHTML = 0;
    
                this.appendChild(this.cost);
            }
        }else{
            this.btn.setAttribute("disabled", "");
            this.btn.value = this.get
        }
        

        this.rendered = true;

    }

    async connectedCallback() {
        if(!this.rendered){
            this.render();
            this.rendered = true;
        }else{
            if (typeof window.ethereum !== 'undefined') {
                let accounts = await window.ethereum.request({ method: 'eth_accounts'});

                if (accounts.length == 0) {
                    this.btn.setAttribute("disabled", "")
                }else{
                    this.connectWeb3();
                    this.btn.addEventListener('click', () => this.mint());
                }
            }else{
                this.btn.setAttribute("disabled", "")
            }
        }
    }

    disconnectedCallback() {
        // browser calls this method when the element is removed from the document
        // (can be called many times if an element is repeatedly added/removed)
    }

    static get observedAttributes() {
        return ["value", "address", "abi"];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (!this.rendered) {
            this.render()
        }
    }

    parseJwt (token) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    
        return JSON.parse(jsonPayload);
    };

    connectWeb3 () {
        if (window.hasOwnProperty("Web3")) {
            this.web3 = new Web3(Web3.givenProvider);
        }
    }

    setCost () {
    }

    mint () {
        if (this.web3 != undefined) {
            console.log(this.abi)
            let contract = new this.web3.eth.Contract(this.abi, this.address);

            contract.methods.mint(1).send({ from: '0xe7360083C41591bd872c32979F1453022582A398', value: (this.costWei * 1)})
        }else{
            this.connectWeb3();
            this.mint();
        }
    }

}

function defineMintButton() {
    customElements.define('gnft-mint-button', GasNFTMintButton);
}

function dinamicallyLoadScript(url) {
    var script = document.createElement("script");  // create a script DOM node
    script.src = url;  // set its src to the provided URL
   
    document.head.appendChild(script);  // add it to the end of the head section of the page (could change 'head' to 'body' to add it to the end of the body section instead)
}

dinamicallyLoadScript("./dist/web3.min.js")

document.addEventListener("DOMContentLoaded", defineMintButton())