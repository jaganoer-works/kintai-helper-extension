// バックグラウンドスクリプト
// 拡張機能の初期化とメッセージ処理を担当

chrome.runtime.onInstalled.addListener(() => {
  console.log('勤怠管理システム 一括入力拡張機能がインストールされました');
});

// アクティブタブでのメッセージ処理
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (sender.tab) {
    // コンテンツスクリプトからのメッセージを処理
    console.log('コンテンツスクリプトからのメッセージ:', message);
  }
  
  // 必要に応じて他の処理を追加
  sendResponse({ received: true });
});

// 拡張機能アイコンのクリックイベント
chrome.action.onClicked.addListener((tab) => {
  if (tab.id) {
    // ポップアップを開く代わりに、コンテンツスクリプトにメッセージを送信
    chrome.tabs.sendMessage(tab.id, {
      type: 'SHOW_POPUP'
    });
  }
}); 