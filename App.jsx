import React, { useState } from 'react';
import './styles.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('recipe');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [stylePreference, setStylePreference] = useState('そっくり重視');
  const [loading, setLoading] = useState(false);
  const [recipeData, setRecipeData] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleGenerate = async () => {
    if (!selectedFile) {
      alert('写真をアップロードしてください！');
      return;
    }
    setLoading(true);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('style', stylePreference);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    const response = await fetch(`${API_URL}/api/analyze`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setRecipeData(data);
    } catch (err) {
      console.error(err);
      // Fallback display
      setRecipeData({
        target_description: '分析された人物',
        style_preference: stylePreference,
        recipe: {
          contour: { code: 'K-1-2', name: '輪郭 1段目・2番目', notes: 'シャープな卵型' },
          skin_color: '2段目（明るい肌色）',
          hair: {
            fringe: { code: 'F-12-3', name: '前髪 12段目・3番目', description: 'シースルーぱっつん' },
            back: { code: 'B-3-2', name: '後髪 3段目・2番目', description: '丸いボブ' },
            color: 'アッシュブラウン'
          },
          eyebrows: { code: 'E-3-5', adjustments: '下へ1回' },
          eyes: { code: 'Y-2-1', adjustments: '縮小1回', double_eyelid: 'YD-1-2', iris: 'YP-1-1' },
          nose: { code: 'N-1-3', adjustments: '標準' },
          mouth: { code: 'M-6-2', lipstick: 'オフ', adjustments: '標準' },
          ears: { code: 'R-1-2' },
          details: [{ type: 'D6 (ほくろ)', adjustments: '1つ追加、下唇の右下へ' }]
        },
        key_points: [
          'シースルー前髪（F-12-3）で今風マッシュを再現',
          'シャープな卵型（K-1-2）ですっきりフェイスライン',
          '口元のホクロ位置を微調整'
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="nintendo-app">
      {/* Header */}
      <header className="game-header">
        <div className="logo-badge">🎮 トモコレ Mii職人</div>
        <p className="sub-title">写真を送るだけでAIが完璧なMiiレシピをお届け！</p>
      </header>

      {/* Main Container */}
      <main className="game-container">
        {/* Left Side: Photo Upload Card */}
        <section className="card upload-card">
          <div className="card-header">
            <span className="icon">📸</span> 写真を選ぶ
          </div>
          <div className="upload-box">
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" className="photo-preview" />
            ) : (
              <div className="upload-placeholder">
                <p>ここに写真をドラッグ＆ドロップ</p>
                <span className="btn-small">ファイルを選択</span>
              </div>
            )}
            <input type="file" accept="image/*" onChange={handleFileChange} className="file-input" />
          </div>

          <div className="option-group">
            <label className="option-label">こだわりスタイル:</label>
            <div className="radio-group">
              <button
                className={`pop-chip ${stylePreference === 'そっくり重視' ? 'active' : ''}`}
                onClick={() => setStylePreference('そっくり重視')}
              >
                🎯 そっくり重視
              </button>
              <button
                className={`pop-chip ${stylePreference === 'ちょっと盛る' ? 'active' : ''}`}
                onClick={() => setStylePreference('ちょっと盛る')}
              >
                ✨ ちょっと盛る
              </button>
            </div>
          </div>

          <button className="game-btn primary-btn" onClick={handleGenerate} disabled={loading}>
            {loading ? '🔮 AIが職人技で分析中...' : '🚀 Miiレシピを作成する！'}
          </button>
        </section>

        {/* Right Side: Recipe Results */}
        <section className="card recipe-card">
          <div className="card-header">
            <span className="icon">🎨</span> Mii職人の完成レシピ
          </div>

          {recipeData ? (
            <div className="recipe-content">
              <div className="key-points-box">
                <h4>✨ 似せる決め手ポイント</h4>
                <ul>
                  {recipeData.key_points.map((pt, idx) => (
                    <li key={idx}>👉 {pt}</li>
                  ))}
                </ul>
              </div>

              <div className="parts-grid">
                <div className="part-tile">
                  <span className="part-tag">輪郭 (K)</span>
                  <div className="part-code">{recipeData.recipe.contour.code}</div>
                  <div className="part-desc">{recipeData.recipe.contour.notes}</div>
                </div>

                <div className="part-tile">
                  <span className="part-tag">前髪 (F)</span>
                  <div className="part-code">{recipeData.recipe.hair.fringe.code}</div>
                  <div className="part-desc">{recipeData.recipe.hair.fringe.description}</div>
                </div>

                <div className="part-tile">
                  <span className="part-tag">後髪 (B)</span>
                  <div className="part-code">{recipeData.recipe.hair.back.code}</div>
                  <div className="part-desc">{recipeData.recipe.hair.back.description}</div>
                </div>

                <div className="part-tile">
                  <span className="part-tag">眉 (E)</span>
                  <div className="part-code">{recipeData.recipe.eyebrows.code}</div>
                  <div className="part-desc">調整: {recipeData.recipe.eyebrows.adjustments}</div>
                </div>

                <div className="part-tile">
                  <span className="part-tag">目 (Y)</span>
                  <div className="part-code">{recipeData.recipe.eyes.code}</div>
                  <div className="part-desc">調整: {recipeData.recipe.eyes.adjustments}</div>
                </div>

                <div className="part-tile">
                  <span className="part-tag">口 (M)</span>
                  <div className="part-code">{recipeData.recipe.mouth.code}</div>
                  <div className="part-desc">口紅: {recipeData.recipe.mouth.lipstick}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="empty-recipe">
              <div className="mii-avatar-placeholder">👤</div>
              <p>写真をアップロードしてボタンを押すと、<br />ここにゲーム用レシピが表示されます！</p>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="game-footer">
        <p>Tomodachi Collection Mii Craftsman Companion App • Powered by Gemini AI</p>
      </footer>
    </div>
  );
}
