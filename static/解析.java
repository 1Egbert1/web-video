package catchVedio;
 
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
 
/**
 * 获取视频接口的json
 * @author Administrator
 *
 */
public class CatchVedio {
//    Socket client = new Scoket();
    private URL url;
    private HttpURLConnection urlConnection;
    private int responseCode;
    private BufferedReader reader;
    private BufferedWriter writer;
    
    
    public static void main(String[] args) {
        CatchVedio cv = new CatchVedio();
        try {
            
            String[] VedioURL = cv.get_VedioURL();//接收
            for(String temp:VedioURL) {//temp是每一个视频的播放地址
                cv.toDownloadURL(cv.analyse(cv.get_Json(temp)));//写出到文件
            }    
        } catch (IOException e) {
            // TODO 自动生成的 catch 块
            e.printStackTrace();
        }finally {
            try {
                cv.reader.close();
                cv.writer.close();
            } catch (IOException e) {
                // TODO 自动生成的 catch 块
                e.printStackTrace();
            }
        }
    
    }
    
    void toDownloadURL(String real_url) throws IOException {//将对应下载地址输出到文件
        this.writer = new BufferedWriter(new FileWriter("D:/worm/downloadURL.txt",true));//定义追加方式写入的流
//        this.writer.append(real_url);
        this.writer.write(real_url+"\r\n");
        this.writer.flush();
    }
    
    String analyse(String json) {//分析json,传回完整下载地址
        int fvkey_index = json.indexOf("\"fvkey\":\"")+9;
        int endIndex = json.indexOf("\"",fvkey_index);
        String fvkey = json.substring(fvkey_index,endIndex);//获取到fvkey
//        System.out.println(fvkey);
        
        int fn_index = json.indexOf("\"fn\":\"")+6;
        int fn_end = json.indexOf("\"",fn_index);
        String fn = json.substring(fn_index,fn_end);//获取到视频文件名 
//        System.out.println(fn);
        
        String head = "http://ugcws.video.gtimg.com/";
        
        StringBuffer real_url = new StringBuffer();
        real_url.append(head);//加入头部
        real_url.append(fn+"?");//加入文件名
        real_url.append("vkey="+fvkey);//加入解锁码
        /*构造成功*/
//        System.out.println(real_url.toString());
        return real_url.toString();
        
    }
    
    String get_Json(String url) throws UnsupportedEncodingException, IOException {
        String line = "";
        StringBuffer sb = new StringBuffer();
        this.url = new URL(url);
        this.urlConnection = (HttpURLConnection)this.url.openConnection();
        this.responseCode = this.urlConnection.getResponseCode();
        if (this.responseCode == 200) {
            this.reader = new BufferedReader(new InputStreamReader(this.urlConnection.getInputStream(), "UTF-8"));
            while ((line = this.reader.readLine()) != null) {
                sb.append(line);// 网页传回的只有一行
            }
            return sb.toString();
        }
        return "";
    }
    
    String[] get_VedioURL() throws IOException {
//    void get_VedioURL() throws IOException {
        File file = new File("D:/worm/vedioURL.txt");
        String line = "";
        this.reader = new BufferedReader(new FileReader(file));
        String[] t = new String[0];
        List<String> container = new ArrayList<String>();
        while(null!=(line = this.reader.readLine())) {
            if(line.equals("")) {
                continue;
            }
            line = this.change(line);//转换一下
            container.add(line);//装入容器
        }
        return container.toArray(t);
    }
    /**
     * http://vv.video.qq.com/getinfo?vids=x0164ytbgov&platform=101001&charge=0&otype=json&defn=shd //格式
     * @param str
     * @return
     * https://v.qq.com/x/page/f08302y6rof.html//页面地址示例
     * https://v.qq.com/x/page/y083158hphd.html
     * https://v.qq.com/x/page/c08503oe58c.html
     */
    String change(String str) {//定义从页面播放地址获取vid转换到后台接口地址的方法
        String head = "http://vv.video.qq.com/getinfo?vids=";
        String tail = "&platform=101001&charge=0&otype=json&defn=shd";
        String vid = str.substring(str.indexOf("page/")+5,str.indexOf(".html"));
        return head+vid+tail;
    }
}
