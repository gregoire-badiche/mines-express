class Train {
    constructor() {
        this.wagons = document.getElementsByClassName('wagon');
        this.landscapes = document.getElementsByClassName('landscape');

        this.iframe = document.getElementById('page');

        this.isSwitching = false;

        this.resetConsts();
        this.resetLandscapes();

        this.current = 0;
        this.goto(this.current);
    }

    resetConsts() {
        this.resetLandscapes();
        this.WAGON_MARGIN_Y = document.body.clientHeight * 0.7;
        this.WAGON_MARGIN_X = Math.floor(this.WAGON_MARGIN_Y * (document.body.clientWidth / document.body.clientHeight));
        document.documentElement.style.setProperty('--wagon-margin-x', this.WAGON_MARGIN_X + 'px');

        this.scrollPos = [];

        for (var i = 0; i < this.wagons.length; i++) {
            this.scrollPos.push(this.wagons[i].offsetLeft - this.WAGON_MARGIN_X / 2);
        };

        return this.scrollPos;
    }

    resetLandscapes() {
        for (let i = 0; i < this.landscapes.length; i++) {
            const ls = this.landscapes[i];
            ls.style.transform = '';
        }
    }

    goto(n) {
        function scrollTo(offset, callback, _this) {
            if(offset < 0) offset = 0;
            // if(offset > document.body.clientWidth * _this.wagons.length) offset = document.body.clientWidth * _this.wagons.length;
            offset = offset.toFixed();
            const onScroll = function () {
                if (window.scrollX == offset) {
                    window.removeEventListener('scroll', onScroll);
                    callback();
                }
            }
    
            window.addEventListener('scroll', onScroll);
            onScroll();
            window.scrollTo({
                left: offset,
                behavior: 'smooth'
            });
        }

        if(this.isSwitching) return;

        this.landscapes[n+1].removeAttribute("current");

        this.isSwitching = true;
        this.current = n;

        this.iframe.style.opacity = '0';

        this.resetLandscapes();

        setTimeout(() => {
            
            scrollTo(this.scrollPos[n], () => {
                setTimeout(() => {
                    var scale = document.body.clientHeight / (document.body.clientHeight - this.WAGON_MARGIN_Y);
                    this.landscapes[n+1].style.transform = `scale(${scale}, ${scale})`;
                    this.landscapes[n+1].setAttribute("current", "");
                    this.iframe.src = `p${n}/p${n}.html`;
                    this.isSwitching = false;
                    setTimeout(() => {
                        this.iframe.style.opacity = '1';
                    }, 1000)
                }, 100);
            }, this)
        }, 1000);
    }

    next() {
        if (this.current != this.wagons.length - 1) {
            this.goto(this.current + 1);
        }
        else {
            this.goto(0);
        }
    }

    previous() {
        if (this.current != 0) {
            this.goto(this.current - 1);
        }
        else {
            this.goto(this.wagons.length - 1);
        }
    }
}

window.addEventListener('DOMContentLoaded', () => {
    window.train = new Train();

    train.next();

    let arrs = document.getElementsByClassName('arrow');
    arrs[0].addEventListener('click', (_e) => {
        train.previous();
    });

    arrs[1].addEventListener('click', (_e) => {
        train.next();
    });

    window.addEventListener('resize', () => {
        train.resetLandscapes();
        setTimeout(() => {
            train.resetConsts();
            train.goto(train.current);
        }, 1000);
    })
})