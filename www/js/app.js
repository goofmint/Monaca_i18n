// ホットペッパーAPIのキー
var api_key = "YOUR_API_KEY";
// 検索結果のレストラン一覧を入れます
var shops = [];

// 国際化の準備
var lng = navigator.languages ? navigator.languages[0] : (navigator.language || navigator.userLanguage);
if (lng.split('-').length == 2)
  lng = lng.split('-')[0];
i18next.use(i18nextXHRBackend).init({
	lng: lng,
	debug: true,
	backend: {
		loadPath: `./locales/${lng}/translation.json`
	}
}, function(err, t) {
  jqueryI18next.init(i18next, $);
  $("[data-i18n]").localize();
});


      
// 画面が切り替わる度に呼ばれます
document.addEventListener('init', function(event) {

  var page = event.target.id;
  // 最初の画面を表示した時の処理
  if (page == "list-page") {
    // レストラン取得ボタンを押した時の処理
    $("#getShops").on("click", () => {
      // 現在位置を取得します
      navigator.geolocation.getCurrentPosition((location) => {
        // 検索実行するURL
        var url = `http://webservice.recruit.co.jp/hotpepper/gourmet/v1/?key=${api_key}&lat=${location.coords.latitude}&lng=${location.coords.longitude}&range=5&order=4&format=json`;
        // Ajax実行
        $.ajax({
          type: 'GET',
          dataType: "json",
          url: url
        }).done((results) => {
          
          // 処理が成功した場合
          shops = results.results.shop;
          for (var i = 0; i < shops.length; i++) {
            var shop = shops[i];
            // リストに追加
            $("#shops").append(`<ons-list-item modifier="chevron" class="shop" tappable><span data-shop-id="${i}">${shop.name}</span></ons-list-item>`);
          }
        }).fail((err) => {
        	// 処理が失敗した場合
          alert("エラー！");
        });
      }, (err) => {
        
      });
    });
    
    // レストラン名をタップした時のイベント
    $(document).on("tap", ".shop", (e) => {
    	
      // レストランデータを特定
      var index = $(e.target).find("span").data("shop-id");
      var shop = shops[index];
      
      
      // ページ移動
      var nav = document.querySelector('#navigator');
      nav.pushPage('detail.html', {data: {shop: shop}});
    });
  }
  
  // 詳細画面を表示した時の処理
  if (page == "detail-page") {
  	$("[data-i18n]").localize();
    // レストランデータを表示
    var shop = event.target.data.shop;
    $("#shop-name").text(shop.name);
    $("#shop-address").text(shop.address);
  }
});
