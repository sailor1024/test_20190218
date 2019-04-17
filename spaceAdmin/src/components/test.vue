<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <style>
        .item {
            height: 20px;
            background: black;
            margin-bottom: 20px;
        }
        .view {
            height: 100px;
            overflow: auto;
        }
    </style>
</head>
<body>
<div class="view">
</div>
</body>
<script src="./jquery.js"></script>
<script>
<<<<<<< HEAD
    // ��������
=======
    // ��������
>>>>>>> 67a8ce1d40f2c156c8150df59c55dca0fcf354c1
    let uuid = 1;
    const thrFn = ({
                       fn,
                       time,
                       maxTime
                   }) => {
        let timeK = null;
        let oTime = (new Date()).getTime();
        const execFn = function () {
            fn.apply(null, arguments);
            oTime = (new Date()).getTime();
        }
        return function() {
            const nTime = (new Date).getTime();
            let args = arguments;
            clearTimeout(timeK);
            if (nTime - oTime > maxTime) {
                execFn.call(null, ...args);
            } else {
                timeK = setTimeout(() => {
                    execFn.call(null, ...args)
                }, time);
            }
        }
    }
    const scroll = ({
<<<<<<< HEAD
                        container = window, // ��������
                        fn, //��������ʱ �ص�����
                        triggerT = 50, // ��������
                        time = 100, // �������� 
                        maxTime = 200, // �������� ��󴥷�ʱ��
                        immediate = false,// ��ʼ�����Ƿ� ֱ�Ӵ����ص�������
                        loadingHtml = '<div class="ee-loading" style="padding: 20px; font-size: 16px; text-align: center">������</div>'
=======
                        container = window, // ��������
                        fn, //��������ʱ �ص�����
                        triggerT = 50, // ��������
                        time = 100, // �������� 
                        maxTime = 200, // �������� ��󴥷�ʱ��
                        immediate = false,// ��ʼ�����Ƿ� ֱ�Ӵ����ص�������
                        loadingHtml = '<div class="ee-loading" style="padding: 20px; font-size: 16px; text-align: center">������</div>'
>>>>>>> 67a8ce1d40f2c156c8150df59c55dca0fcf354c1
                    }) => {
        const $elem = $(container);
        const elem = $elem.get(0);
        const $elemT = (elem === window ? $(window) : $elem);
<<<<<<< HEAD
        // ��ʼ���߶�
        let startY = 0;
        const $loading = $(loadingHtml);
        // �Ƿ���ʾloading
=======
        // ��ʼ���߶�
        let startY = 0;
        const $loading = $(loadingHtml);
        // �Ƿ���ʾloading
>>>>>>> 67a8ce1d40f2c156c8150df59c55dca0fcf354c1
        const showLoading = (flag) => {
            const $container = elem === window ? $('body') : $elem;
            if (flag === true) {
                $container.append($loading);
            } else {
                $loading.remove();
            }
        }
<<<<<<< HEAD
        // ����
=======
        // ����
>>>>>>> 67a8ce1d40f2c156c8150df59c55dca0fcf354c1
        const fixFn = thrFn({
            fn,
            time,
            maxTime
        });
<<<<<<< HEAD
        // ��ȡԪ�ع����� �������������߶�
=======
        // ��ȡԪ�ع����� �������������߶�
>>>>>>> 67a8ce1d40f2c156c8150df59c55dca0fcf354c1
        const MakeScrollTop = (elem) => {
            return () => {
                if (elem === window) {
                    return window.pageYOffset || window.document.documentElement.scrollTop
                }
                return elem.scrollTop
            }
        };
<<<<<<< HEAD
        // ��ȡ Ԫ�ع����߶�
=======
        // ��ȡ Ԫ�ع����߶�
>>>>>>> 67a8ce1d40f2c156c8150df59c55dca0fcf354c1
        const scrollHeight = (elem) => {
            if (elem === window) {
                return window.document.documentElement.scrollHeight || window.document.body.scrollHeight
            }
            return elem.scrollHeight
        }
<<<<<<< HEAD
        // ����Ԫ�� ��������� �����߶�
=======
        // ����Ԫ�� ��������� �����߶�
>>>>>>> 67a8ce1d40f2c156c8150df59c55dca0fcf354c1
        const setScrollTop = (y) => {
            if (elem === window) {
                window.pageYOffset = window.document.documentElement.scrollTop = y;
                return
            }
            elem.scrollTop = y;
        }
        const getScrollTop = MakeScrollTop(elem);
        const eventFn = () => {
<<<<<<< HEAD
            // ��ǰ��������
            let currentY = getScrollTop();
            // ��ǰ������ʵ�߶�
            let height = $elem.height();
            // console.log(height);
            // ��ǰ��������������
            let allY = scrollHeight(elem) - height;
            // �����ж� �������ж�
=======
            // ��ǰ��������
            let currentY = getScrollTop();
            // ��ǰ������ʵ�߶�
            let height = $elem.height();
            // console.log(height);
            // ��ǰ��������������
            let allY = scrollHeight(elem) - height;
            // �����ж� �������ж�
>>>>>>> 67a8ce1d40f2c156c8150df59c55dca0fcf354c1
            if (currentY - startY > 0 && allY - currentY <= triggerT) {
                fixFn(showLoading, currentY);
            }
            startY = currentY;
        }
        $elemT.on('scroll', eventFn);
        const offScroll = () => {
            $elemT.off('scroll', eventFn);
        }
        immediate && fn(showLoading, 0);
        return {
            offScroll,
            setScrollTop
        }
    };
<<<<<<< HEAD
    // ʹ�ô���
=======
    // ʹ�ô���
>>>>>>> 67a8ce1d40f2c156c8150df59c55dca0fcf354c1
    const htmlTemplate = `<div class="item">num</div>`
    const list = new Array(8).fill(true);
    let time = 0;
    let busy = false;
    const fn = function(load, y) {
<<<<<<< HEAD
        // console.log(y);
=======
        console.log(y);
>>>>>>> 67a8ce1d40f2c156c8150df59c55dca0fcf354c1
        if (busy === false) {
            busy = true;
            load(true);
            setTimeout(() => {
                load(false)
                busy = false;
                time++;
                const str = list.map(item => htmlTemplate).join('').replace(/num/g, time);
                $('.view').append(str);
            }, 2000)
        }
    };
    const handler = scroll({
        container: $('.view'),
        fn,
        immediate: true
    })
</script>
</html>