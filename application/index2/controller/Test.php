<?php
/**
 * Created by PhpStorm.
 * User: admin
 * Date: 2018/11/20
 * Time: 17:45
 */

namespace app\index2\controller;

use app\common\Cos;
use app\common\Token;
use app\index2\model\ItemsDir;
use think\Request;

class Test {
    private $InviteCooperatorMode;
    public $full_clone;
    public $ffclone;

    public function __construct() {
        //$this->ModelIndex = new ModelIndex();
        //实列化InviteCooperator获取文件或者项目操作权限
        //$this->InviteCooperatorMode = new InviteCooperator();
        //$this->full_clone = $full_clone;
        //$this->setFull();
    }

    public function test_cos() {
        $cos = new Cos('kanyun3d3c-1257907741');
        //$res = $cos->upFile('0aa34ed86a794d79bc5e0a0bafdad3ef/index3.html', './index3.html');
        //$res=$cos->GetObject('0aa34ed86a794d79bc5e0a0bafdad3ef/button.css','./');
        $res=$cos->createBuket();
        echo '<pre>';
        var_dump($res);
    }

    public function test_model() {
        /* $itemsDir = new \app\index2\model\ItemsDir();
         $param = [];
         $param['items_dir_id'] = 345;
         $param['dir_id'] = 397;
         $param['company_id'] = 1;
         $param['user_id'] = 1;
         $array = $itemsDir->setInviteItems($param);
         echo '<pre>';
         var_dump($array);*/
        /*$ItemsMode = new \app\index2\model\Items();
        $iemsId = 2188;
        $pId = 404;
        $userId = 1;
        $array = $ItemsMode->setInvitcPath($iemsId, $pId, $userId);
        echo '<pre>';
        var_dump($array);*/
        /*$invModel = new  InviteCooperator();
         $array = [2257];
         foreach ($array as $k => $v) {
             $param['items_id'] = $v;
             $ka[] = $invModel->setInvitcItems($param);
         }
         var_dump($ka);*/
        // $array = $this->getpTree(411);
        $param['items_dir_id'] = 432;
        $param['company_id'] = 61;
        $param['dir_id'] = 399;
        $i = new ItemsDir();
        $a = $i->setInviteItems($param);
        echo '<pre>';
        var_dump($a);
    }

    protected function fileTree($fileId) {
        $array = [];
        $model = new ItemsDir();
        $param['where']['id'] = $fileId;
        $param['field'] = ['dir_father_id'];
        $pId = $model->where(['id' => $fileId])->field(['dir_father_id', 'id'])->find();
        if ($pId['id'] > 0) {
            $array = $this->fileTree($pId['dir_father_id']);
            $array[] = $fileId;
        }
        return $array;
    }

    /****
     *查找子ID
     **/
    protected function getpTree($pid) {
        $array = [];
        $model = new ItemsDir();
        $param['where']['id'] = $pid;
        $pId = $model->where(['dir_father_id' => $pid])->field(['dir_father_id', 'id'])->find();
    }

    public function get_token(Token $token) {
        /*$dir = $_SERVER['HTTP_HOST'];
        var_dump(ROOT_PATH . '/public');
        die();*/
        //echo json_encode([308,309]);
        $param['where']['token'] = '7a74c81621770e6e5a756726b55fd751';
        $data = $token::setUserTonken($param);
        //var_dump($data);
        $param['key_name'] = '7a74c81621770e6e5a756726b55fd751';
        $data = $token::getUserGreps($param);
        var_dump($data);
        /** $itemsDirModel = new ItemsDir();
         * $path = '12-14-309-308';
         * $_path = "12-14";
         * var_dump($itemsDirModel->getPath($path, $_path));*/
        /* $mode = new \app\index2\model\Items();
         $where =['id' => 2000, 'user_id' => 1];
         $data = $mode->where($where)->select();
         var_dump($data);*/
    }

    /***
     *   测试
     **/
    /* public function getTokenAll(full_clone $full_clone)
     {
         $this->full = $full_clone;
         return $this->full;
     }*/

    /* public function getFull($model)
     {
         $this->full_clone = $model;
         return $this->full_clone;
     }

     public function setFull()
     {
         // $this->ffclone = $this->getFull(clone $this->full_clone);

     }

    public function up_del()
    {
        $t = $this->full_clone->del_func();
        echo $t;
    }*/

    /**
     *   测试
     **/
    public function getasall() {
        $request = Request::instance();
        echo $request->controller();
        echo $request->action();
        $id = $request->get('help');
        echo $id;
        $mm = $request->get('mm');
        $data['code'] = 200;
        $data['message'] = 'ok';
        $data['data']['code'] = 200;
        $data['data']['message'] = 'ok';
        $data['data']['info'] = ['id' => $id, 'mm' => $mm];
        echo json_encode($data);
    }

    public function test_a() {  // $area = [''];
        $file = db("items")->field('id')->select();
        for ($i = 0;$i<count($file);$i++) {
            $a1 = mt_rand(1,9999);
            $a2 = mt_rand(200000,999999);
        if ($a2 > $a1) {
            $temp = $a2;
            $a2 = $a1;
            $a1 = $temp;
        }
        $random = $a1/$a2; //面积
        $random =   sprintf("%.2f",$random) ;
        $house_type = rand(1,10). "室" . rand(1,3). "厅";
        $temp_weizhi = ['南,北','东,西','西,东','东,西','北,南'];
        $chaoxiang = $temp_weizhi[rand(0, count( $temp_weizhi)-1 )];
        $file[$i]['items_area'] = $random ;
        $file[$i]['items_orientation'] = $chaoxiang ;
        $file[$i]['house_type'] = $house_type ;
        db('items')->update($file[$i]);
        }
        //
        dump($file);
    }


    public function test_get_all_items() {
        $items_data = db('items')->field('id,dirname')->select();
        echo json_encode($items_data, JSON_UNESCAPED_UNICODE);
        exit;
    }

    //给汉铭做测试用
    public function get_items_list() {
        echo "<center style='font-size:20px;'>项目管理</center> <br/>";
        $items_list = db('items')->limit(40)->order('id','desc')->select();
        echo "<table border='2' style='border-collapse:collapse; margin:0px auto;' >";
            echo "<tr style='text-align:center;'>";
                echo "<td style='padding: 10px 10px;' > id </td>";
                echo "<td style='padding: 10px 10px;' > dirname（uuid） </td>";
                echo "<td style='padding: 10px 10px;' > longitude(经度) </td>";
                echo "<td style='padding: 10px 10px;' > latitude（纬度） </td>";
                echo "<td style='padding: 10px 10px;' > address(SSQ) </td>";
                echo "<td style='padding: 10px 10px;' > title(文件名) </td>";
                echo "<td style='padding: 10px 10px;' > location（地址） </td>";
                echo "<td style='padding: 10px 10px;' > 上传时间 </td>";
            echo "</tr>";
            foreach ($items_list as $k => $v) {
                echo "<tr  style='text-align:center;' >";
                    echo "<td style='padding: 10px 10px;' > ". $v['id']." </td>";
                    echo "<td style='padding: 10px 10px;' > ". $v['dirname']."  </td>";
                    echo "<td style='padding: 10px 10px;' >". $v['longitude']."   </td>";
                    echo "<td style='padding: 10px 10px;' > ". $v['latitude']."  </td>";
                    echo "<td style='padding: 10px 10px;' > ". $v['address']." </td>";
                    echo "<td style='padding: 10px 10px;' > ". $v['title']." </td>";
                    echo "<td style='padding: 10px 10px;' > ". $v['location']." </td>";
                    echo "<td style='padding: 10px 10px;' > ". date("Y-m-d H:i:s" , $v['create_time']) ." </td>";
                echo "</tr>";
            }
        echo "</table>";
        echo "<hr/>";
        dump($items_list);
    }

    public function test_qianduan_descript(){
        // 
        // 
        $decrypt_phone = encrypt_qianduan('13413326042'); // MWUzZDRlMTczYTMzMjQ2MDAzNGIyNQ==
        echo $decrypt_phone;

        echo "<br/>";
       $password = md5('kyky8888');
       echo $password;
       echo "<br/>";
       // company_name="测试20190410-公司名"
       // &decrypt_phone=MWUzZDRlMTczYTMzMjQ2MDAzNGIyNQ==
       // &decrypt_email=13413326042@qq.com
       // &password=732e9572858f0d602884e309c447f521
       // &lastname=赵
       // &firstname=子安

       // company_name=测试20190410-公司名&decrypt_phone=MWUzZDRlMTczYTMzMjQ2MDAzNGIyNQ==&decrypt_email=13413326042@qq.com&password=732e9572858f0d602884e309c447f521&lastname=赵&firstname=子安
    
        echo "md5.14715906787 => ". sha1(md5('14715906787'));
    }

}

?>