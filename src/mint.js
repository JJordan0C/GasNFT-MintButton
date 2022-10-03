class GasNFTMintButton extends HTMLElement {

    
    constructor() {
        super();
        
        /* Web3 Attrs */
        var rendered = false;
        let account = undefined;
        let web3 = undefined;
        let contract = undefined;
        let coseWei = undefined;
        let maxMint = 0; //TO-DO
        let chains = {
            mainnet: "0x1",
            goerli: "0x5",
            sepolia: "0xaa36a7"
        }
        
        /* HTML Attrs */
        let btn = undefined;
        let inpMint = undefined;
        let costEth = undefined;

        /* Utils Attrs */
        const prefixConsole = undefined;
        let requireInput = false;
        let requireCost = false;
    }

    render() {
        this.prefixConsole = "[GasNFT-MintButton-v.0.0.1]";
        this.requireInput = this.getAttrOrDefault("inp-mint", false);
        this.requireCost = this.getAttrOrDefault("show-cost", false);

        this.btn = document.createElement("button");

        if (window.ethereum) {
            /**
             * Connect the host to Web3 and retrieve
             * contract from abi (parsed JWT) and address
             */
            this.connectWeb3();

            this.contract = new this.web3.eth.Contract(this.parseJwt(this.getAttribute("abi")), this.getAttribute("address"));

            /**
             * Initialize the input for mint
             * only if rquired from attribute [inp-mint]
             * and set default attributes
             */

            if (this.requireInput) {
                this.inpMint = document.createElement("input");
                this.inpMint.setAttribute("type", "number");
                this.inpMint.setAttribute("min", "1");
                this.inpMint.setAttribute("placeholder", "1")
            }

            if (this.requireCost) {
                this.costEth = document.createElement("p");
                this.costEth.innerHTML = 0;
            }
        }

        this.btn.innerHTML = this.getAttrOrDefault("title", "Mint");

        this.appendChild(this.btn);
        this.appendChildIfRequired(this.requireInput, this.inpMint);
        this.appendChildIfRequired(this.requireCost, this.costEth);
        this.rendered = true;
    }

    async connectedCallback() {
        if (!this.rendered) {
            this.render();
            this.rendered = true;
        } else {
            if (window.ethereum) {
                let accounts = await window.ethereum.request({ method: 'eth_accounts'});

                window.ethereum.on('chainChanged', chainId => {
                    // TO-DO
                })

                if (accounts.length == 0) {
                    this.btn.setAttribute("disabled", "");

                    this.btn.innerHTML = this.getAttrOrDefault("no-wallet", "Connect your wallet!")
                } else {
                    this.account = accounts[0];

                    /**
                     * From contract retrieve cost in Wei
                     * and convert with utils to eth
                     */
                    this.contract.methods.cost().call({ from: this.account }, (err, res) => {
                        this.costWei = res;
                        this.costEth.innerHTML = this.web3.utils.fromWei(res, "ether");
                    })
                            
                    this.btn.addEventListener('click', () => this.mint());
                }
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

    /* METHODS UTILS */

    /**
     * Function to parse JWT token used to
     * parse abi from JWT to array
     * 
     * @param {string} token 
     * @returns abi
     */

    parseJwt (token) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    
        return JSON.parse(jsonPayload);
    };

    /**
     * To get value of attribute only if setted,
     * otherwise give back a default value.
     * 
     * @param {string} attr 
     * @param {*} fallback 
     * @returns any
     */

    getAttrOrDefault (attr, fallback) {
        return this.getAttribute(attr) == null ? fallback : this.getAttribute(attr);
    }

    /**
     * Append child only if required to this
     * element
     * 
     * @param {boolean} attr 
     * @param {HTMLElement} element 
     */

    appendChildIfRequired(attr, element) {
        if (attr) {
            this.appendChild(element)
        }
    }

    /**
     * Utils for warn in console
     * 
     * @param {string} warn 
     */

    consoleWarn (warn) {
        console.warn(`${this.prefixConsole} ${warn}`);
    }

    /**
     * Connect your client to Web3 service,
     * so you can use the mint button and other
     * functionality of this plugin.
     */

    connectWeb3 () {
        if (window.hasOwnProperty("Web3")) {
            this.web3 = new Web3(Web3.givenProvider);
        }else{
            this.consoleWarn("Web3 not detected!")
        }
    }


    mint () {
        if (this.web3 != undefined) {
            this.contract.methods.mint(1).send({ from: this.account, value: (this.costWei * 1)})
        }else{
            this.connectWeb3();
            this.mint();
        }
    }

}

function defineMintButton() {
    customElements.define('gnft-mint-button', GasNFTMintButton);
}

function dynamicallyLoadScript(url) {
    var script = document.createElement("script");  // create a script DOM node
    script.src = url;  // set its src to the provided URL
   
    document.head.appendChild(script);  // add it to the end of the head section of the page (could change 'head' to 'body' to add it to the end of the body section instead)

    return script;
}


window.addEventListener("load", () => {
    if (!window.hasOwnProperty("Web3")) {
        console.warn("[GasNFT-MintButton] Web3 not detected!")

        let scriptWeb3 = dynamicallyLoadScript("https://cdnjs.cloudflare.com/ajax/libs/web3/1.8.0/web3.min.js");

        console.warn("[GasNFT-MintButton] adding it dynamically by cdn...")
        scriptWeb3.onload = () => {
            console.warn("[GasNFT-MintButton] Web3 loaded dynamically in this page!")
            console.warn("[GasNFT-MintButton] You can view the script in <head></head> tag!")

            defineMintButton();
        }
    }else{
        defineMintButton();
    }
})