<?php
/**
 * @title 文件上传
 * @class Upload
 */
class Upload {
  
  /**
	 * @title 资源文件上传
	 * @url /index/Upload/upload_file
	 * @param File file 文件资源 空 必须
	 * @param string userid 用户id 空 必须
	 * @param string longitude 经度 空 必须
	 * @param string latitude 纬度 空 必须
	 * @param string title 标题 空 必须
   * @method POST
	 * @code 1 成功
	 * @code 0 失败
	 * @return int code 状态码
	 * @return obj data 返回的用户数据数据
	 * @return obj data[].srcpath 网络上的路径
	 */
  public function upload_file(){
    $file = request()->file('file');
    $srcpath = '';
    $code = 0;
    if($file){
      $filepath = ROOT_PATH . DS . 'public' . DS . 'assets' . DS . 'museum' . DS . '01';
      $info = $file->validate(['ext'=>'zip'])->move($filepath);
      if($info){
        // 成功上传后 获取上传信息
        $srcpath = $filepath . DS . $info->getSaveName();
        $code = 1;
      }
    }
    $array = array(
      'srcpath' => $srcpath
    );
    $this->json_echo($array,$code);
  }
}