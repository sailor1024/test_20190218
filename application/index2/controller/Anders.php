<?php
/**
 * Created by PhpStorm.
 * User: NickDeng
 * Date: 2018/12/27
 * Time: 11:29
 */

namespace app\index2\controller;

use app\index2\model\StatisticsView;
use app\index2\model\StatisticsViewCount;
use app\index2\model\StatisticsUserIpDevice;
use app\index2\model\InviteCooperator;
use app\index2\model\Items;
use think\Db;
use app\common\Token;

class Anders extends Base {
    public function Counter() {
        $countNum = Db::name('anders_counter')->order('id', 'desc')->field('num')->find();
        $countNum['num'] += 1;
        Db::name('Anders_counter')->insert($countNum);
        switch (strlen($countNum['num'])) {
            case 1:
                $num = '00' . $countNum['num'];
                break;
            case 2:
                $num = '0' . $countNum['num'];
                break;
            default:
                $num = $countNum['num'];
        }
        $res = 'LIGHTMAGIC-ISR-101-' . $num;
        return json_encode($res);
    }


    public function Txt() {
        $jsonRaw = input('param.');
//        halt($jsonRaw);
        //文件名
        $fileName = date("Ymd-His", time());
        //保存、读取目录
//        $keyName = '';
//        foreach ($_FILES as $k=>$v){
//            $keyName=$k;
//        }
//        $dirWhere = dirname($_FILES[$keyName]['tmp_name']);
        //文本内容
//        $txt = file_get_contents ($_FILES[$keyName]['tmp_name']);
        $dirName = array_keys($jsonRaw)[0];
        $txt = $jsonRaw[$dirName];
        //文件夹名
//        $nameArray = explode('"',$txt);
//        $dirName = $nameArray[1];
//        $fileContent = base64_decode($nameArray[3]);
        $fileContent = base64_decode($txt);
        $writeFileName = '/home/ubuntu/scanner_setup/'.$dirName.'/'.$fileName.'.txt';

        if (!file_exists('/home/ubuntu/scanner_setup/'.$dirName)) {
            mkdir('/home/ubuntu/scanner_setup/'.$dirName);
        }

        $writeFile = fopen($writeFileName,'x');
        fwrite($writeFile,$fileContent);
        fclose($writeFile);
        $txtss = file_get_contents ($writeFileName);
        if ($txtss != '') {
            $array = ['status' => 'ok', 'index' => $writeFileName
//                ,'content'=>$txtss
            ];
            $json = json_encode($array, JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES);
            return $json;
        } else {
            return json(['status'=>'write file fetal']);
        }
            return 'ok';
    }
}