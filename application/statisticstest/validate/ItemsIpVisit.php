<?php 
namespace app\statisticstest\validate;

use think\Validate;
use think\Db;

class ItemsIpVisit extends Validate {    

	protected $rule = [
		'items_dirname' =>'checkDirname:',
		'client_ip' => 'checkIpStatus:',
	];

	protected $message = [
		'items_dirname.checkDirname' => '路径不存在',
		'client_ip.checkIpStatus' => '该项目浏览量已经纪录',
	];

	//检查dirname是否存在
	protected function checkDirname($v, $r, $data) {   
		$judgement = Db::table('items')->where('dirname', $v)->find();
		
		if ($judgement) {
			return true;
		} else {
			return false;
		}

	}

	//检查client_ip在当天是否已经存在
	protected function checkIpStatus($v, $r, $data) {  
		$date = date('Ymd', time());
		$judgement = Db::table('items_ip_visit')->where('items_dirname', $data['items_dirname']) ->where('client_ip', $v)->where('date', $date)->find();

		if ($judgement) {
			Db::table('items_ip_visit')->where('id',$judgement['id'])->setInc('visit_count');
			return false;
		} else {
			return true;
		}
		
	}


}



?>