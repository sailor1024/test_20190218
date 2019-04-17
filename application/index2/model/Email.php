<?php
namespace app\index2\model;

use think\Model;
use think\Db;

class Email extends Model{

    //发送邮件邀请
    public function send_invite($entity){

        if( empty($entity['invite_user_type']) ){
            throw new \Exception('没有邀请权限类型');
        }else{
            $invite_user_type=$entity['invite_user_type'];
        }

        if( empty($entity['invite_email'])  ){
            throw new \Exception('没有邀请的邮箱');
        }
        $invite_email=$entity['invite_email'];
        
        $decrypt_email_save=decrypt($invite_email); //解密 ,解密后是 admin@admin.com
        $email_save = sha1(md5($decrypt_email_save)); //加密后的邮箱，和用户表的加密方式一样

        //先去看看有没有已经注册
        $find_email=Db::name('user')->where('decrypt_email',$decrypt_email_save)->field('id,is_use,company_id')->find();
        if($find_email){ //已经被注册
            if($find_email['company_id'] != $entity['company_id']){
                throw new \Exception('邀请的邮箱已经被注册了!'); 
            }else{
                if($find_email['is_use'] == 1){
                    throw new \Exception('该用户已经存在合作者列表中!');
                }else if($find_email['is_use'] == 0){
                    throw new \Exception('该账号已被删除，您可以在已删除列表中恢复该账号!');
                }
            }    
        }

        $content = !empty($entity['content']) ? $entity['content'] : '注册邀请';//邀请是输入邀请信息    

        $user_id=$entity['user_id']; //用户id
        $company_id=$entity['company_id']; //公司id

        $email_key= mt_rand(123456,654321) . uniqid(). date('Ymd') .rand(1000,9999) ; //随机产生一个邮箱注册验证码
        $create_time=time();//邀请时间
        $end_time=time();   //有效期，到时候再设置
        $valid=1;

        try{
            
            //更新该邮箱
            $saveSql="replace into email_invite (user_id,company_id,invite_email,email,user_type,content,email_key,create_time,end_time,valid) 
            values  (
                '{$user_id}',
                '{$company_id}',
                '{$decrypt_email_save}',
                '{$email_save}',
                '{$invite_user_type}',
                '{$content}',
                '{$email_key}',
                '{$create_time}',
                '{$end_time}',
                '{$valid}'
                    )
            ";
           $res=Db::execute($saveSql); //如果相同邮箱邀请多次，将更新最后一次的邮箱信息，之前存储将被删除

           if($res > 0){ //证明存进了数据库，去发送邮箱
            

            $toemail= $decrypt_email_save ; // admin@admin.com
            $name= !empty($entity['name']) ? $entity['name'] :'广东康云科技空间扫描邀请！';
            $title= $content ;
            //$title='用户邀请注册';
            $http_link = $_SERVER['REQUEST_SCHEME'] .'://'.$_SERVER['HTTP_HOST'];//https://www.xxx.com
            $urlherf = $http_link . "/#/account/registration?email_key={$email_key}&email={$toemail}";
            //$urlherf = "http://todo.kangyun3d.cn/#/account/registration?type=2&userid=3&email={$toemail}";
            $content_body = "广东康云科技邀请您加入，请点击<div><a href='{$urlherf}'>". $http_link ."</a>查看</div>";
                
                    $res_email=$this->send_mail($toemail,$name,$title,$content_body);
                    if($res_email == 200){ //成功
                        $result['code']= 200;
                        $result['message']= '发送邀请成功！';
                        $return['data']=[];

                    }else{
                        $result['code']= 201;
                        //$result['message']= $res_email;//获取邮件插件的错误
                        $result['message']= '邮件邀请异常，请重新邀请！';//获取邮件插件的错误
                        $return['data']=[];
                    }
                        
           }
           
        }catch(\Exception $e){
            $result['message'] = $e->getMessage();
            $result['code']='401';
            $return['data']=[];
        }

        return $result;
    }


    //再次发送邀请
    public function again_send_invite($entity){
        
         if(empty($entity['email_invite_id'])){
            throw new \Exception('没有邀请表的 email_invite_id');
        } 
              
        try{
            //先查询数据库中有没有该数据id字段
            $find_invite=Db::name('email_invite')
                        ->where('id',$entity['email_invite_id'])
                        ->field('content,invite_email')
                        ->find();
            if(empty($find_invite)){
                throw new \Exception('找不到该 email_invite_id');
            }

            
            //到这里还能执行，证明该数据是匹配的
            $email_key= mt_rand(123456,654321) . uniqid(). date('Ymd') .rand(1000,9999) ; //随机产生一个邮箱注册验证码
            
             $end_time=time();   //有效期，到时候再设置
            $save_data=[
                'create_time'=>time(),
                'end_time' =>$end_time,
                'valid' =>1,
                'email_key'=>$email_key,
            ];
            //更新刚才查询的数据
            $res=Db::name('email_invite')->where('id',$entity['email_invite_id'])->update($save_data);
            if($res > 0){ //证明存进了数据库，去发送邮箱   

                $toemail=$find_invite['invite_email'];  //真邮箱，没有加密
               
                $name= !empty($entity['name']) ? $entity['name'] :'广东康云科技空间扫描邀请！';
                $title=$find_invite['content']; //从数据中找出上次邀请的内容
                //$title='再次邀请用户注册';
                $http_link = $_SERVER['REQUEST_SCHEME'] .'://'.$_SERVER['HTTP_HOST'];//https://www.xxx.com
                $urlherf = $http_link . "/#/account/registration?email_key={$email_key}&email={$toemail}&test=testTwo";
                //$urlherf = "http://todo.kangyun3d.cn/#/account/registration?type=2&userid=3&email={$toemail}";
                $content_body = "广东康云科技邀请您加入，请点击<div><a href='{$urlherf}'>". $http_link . "</a>查看</div>";
                    
                        $res_email=$this->send_mail($toemail,$name,$title,$content_body);
                        if($res_email == 200){ //成功
                            $result['code']= 200;
                            $result['message']= '再次发送邀请成功！';
                            $return['data']=[];
    
                        }else{
                            $result['code']= 201;
                            $result['message']= $res_email;
                            $return['data']=[];
                        }
                    
                   
               }


        }catch(\Exception $e){
            $result['message'] = $e->getMessage();
            $result['code']='401';
            $return['data']=[];
        }
        return $result;
    }

    //删除邀请
    public function delete_invite($entity){

        if(empty($entity['email_invite_id'])){
            throw new \Exception('没有邀请表的 email_invite_id');
        }

        $res=Db::name('email_invite')->delete($entity['email_invite_id']);
        $result['message'] = '操作成功！';
        $result['code'] = 200;
        $result['data'] = [];
        if(!$res){
            $result['message'] = '操作失败！';
            $result['code'] = 202;
        }

        return $result;

    }

    /**
	 * 系统邮件发送函数
	 * @param string $tomail 接收邮件者邮箱
	 * @param string $name 接收邮件者名称
	 * @param string $subject 邮件主题
	 * @param string $body 邮件内容
	 * @param string $attachment 附件列表
	 * @return boolean
	 * @author static7 <static7@qq.com>
	 */
	public function send_mail($tomail, $name, $subject = '', $body = '', $attachment = null) {

        vendor('phpmailer.phpmailer.src.PHPMailer');
        vendor('phpmailer.phpmailer.src.SMTP');
        vendor('phpmailer.phpmailer.src.Exception');
        //require('phpmailer/phpmailer/src/PHPMailer.php');
        //require('phpmailer/phpmailer/src/SMTP.php');
        //require('phpmailer/phpmailer/src/Exception.php');
        $mail = new \PHPMailer\PHPMailer\PHPMailer();  //实例化PHPMailer对象
    
        $mail->CharSet = 'UTF-8';           //设定邮件编码，默认ISO-8859-1，如果发中文此项必须设置，否则乱码
        $mail->IsSMTP();                    // 设定使用SMTP服务
        $mail->SMTPDebug = 0;               // SMTP调试功能 0=关闭 1 = 错误和消息 2 = 消息
        $mail->SMTPAuth = true;             // 启用 SMTP 验证功能
        $mail->SMTPSecure = 'ssl';          // 使用安全协议
        //$mail->Host = "smtp.exmail.qq.com"; // SMTP 服务器
        $mail->Host = "smtp.qq.com"; // SMTP 服务器
        $mail->Port = 465;                  // SMTP服务器的端口号
        $mail->Username = "1663852293@qq.com";    // SMTP服务器用户名
        $mail->Password = "nvajpvaunzvjdhfa";     // SMTP服务器密码	//nvajpvaunzvjdhfa
        $mail->SetFrom('1663852293@qq.com',$name);
        //$mail->From='1663852293@qq.com';
        $replyEmail = '';                   //留空则为发件人EMAIL
        $replyName = '';                    //回复名称（留空则为发件人名称）
        $mail->AddReplyTo($replyEmail, $replyName);
        $mail->Subject = $subject;
        $mail->MsgHTML($body);
        $mail->AddAddress($tomail, $name);
        // if (is_array($attachment)) { // 添加附件
        //     foreach ($attachment as $file) {
        //         is_file($file) && $mail->AddAttachment($file);
        //     }
        // }
        
        return $mail->Send() ?  200 : $mail->ErrorInfo;
        //return $mail->Send() ? '发送成功' : $mail->ErrorInfo;

    }

}