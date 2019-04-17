<?php 
namespace app\statisticstest\model;

use think\Db;
use think\Model;

class ItemsIpVisit extends Model{
	protected $pk = 'id';
	protected $table = 'items_ip_visit';
	protected $autoWriteTimestamp = 'timestamp'  ; //自动完成时间
	protected $createTime = 'date_time';
    protected $updateTime = false;
	protected $insert = ['date','user_id','company_id'];
    protected $type = [
    	'id' => 'integer',
    	 'date' =>'integer',
    	 'date_time'=>'integer',
    	 'user_id'=>'integer',
    	 'company_id'=>'integer',

    ];

	//自动完成日期 并 进库
	protected function setDateAttr($v) {
		return date('Ymd', time()); 
	}
 
    //进库user_id
	protected function setUserIdAttr($v, $data) {
		$datas = Db::table('items')->where('dirname', $data['items_dirname'])->find(); 

		if (isset($datas['user_id'])) {
			return $datas['user_id'];
		} else {
			return 0;
		}

	}

	//进库company_id
	protected function setCompanyIdAttr($v, $data) {
		$datas = Db::table('items')->where('dirname', $data['items_dirname'])->find(); 

		if (isset( $datas['company_id'])) {
			return $datas['company_id'];
		} else {
			return 0;
		}
		
	}

  
}