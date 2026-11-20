"use client";

import { useEffect, useRef, useState } from "react";
import Cropper, { type Area, type Point } from "react-easy-crop";
import { UploadIcon } from "@/components/common/icons";

type Props = {
  currentImageUrl: string | null;
};

// 메인페이지 '브리더 소개' 섹션 아이템 이미지와 동일한 비율
const IMAGE_ASPECT = 380 / 525;
// 원본 사진 자체는 서버로 전송되지 않지만(브라우저에서 크롭 후 결과물만 업로드),
// 과도하게 큰 원본을 캔버스로 디코딩하면 느려지므로 선택 단계에서만 가볍게 제한한다.
const MAX_SOURCE_SIZE = 20 * 1024 * 1024;
// 결과물 용량을 안정적으로 작게 유지하기 위한 출력 폭 상한(px). 서버 액션 요청 본문 제한(8MB)과 무관하게 항상 여유가 생긴다.
const MAX_OUTPUT_WIDTH = 960;

export function BreederImageField({ currentImageUrl }: Props) {
  const sourceInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const objectUrlsRef = useRef<string[]>([]);

  const [cropping, setCropping] = useState(false);
  const [originalSrc, setOriginalSrc] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [area, setArea] = useState<Area | null>(null);

  const [preview, setPreview] = useState<string | null>(currentImageUrl);

  useEffect(() => {
    const urls = objectUrlsRef.current;
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  function trackUrl(url: string) {
    objectUrlsRef.current.push(url);
    return url;
  }

  function startCropFromFile(file: File) {
    if (!file.type.startsWith("image/")) {
      setError("이미지 파일만 업로드할 수 있습니다.");
      return;
    }

    if (file.size > MAX_SOURCE_SIZE) {
      setError("20MB 이하의 이미지만 업로드할 수 있습니다.");
      return;
    }

    setOriginalSrc(trackUrl(URL.createObjectURL(file)));
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setArea(null);
    setError(null);
    setCropping(true);
  }

  function handleSourceSelected(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (file) startCropFromFile(file);
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) startCropFromFile(file);
  }

  async function handleConfirm() {
    if (!originalSrc || !area) return;

    try {
      const blob = await cropToBlob(originalSrc, area);
      setFormFile(fileInputRef.current, blob, "breeder.jpg");
      setPreview(trackUrl(URL.createObjectURL(blob)));
      setCropping(false);
      setOriginalSrc(null);
    } catch {
      setError("사진 크롭 처리에 실패했습니다. 다시 시도해주세요.");
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium">
        사진 <span className="text-red-600">*</span>
      </label>

      {!cropping && (
        <div
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={(event) => {
            event.preventDefault();
            setIsDragging(false);
          }}
          onDrop={handleDrop}
          onClick={() => sourceInputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              sourceInputRef.current?.click();
            }
          }}
          className={`flex cursor-pointer flex-col items-center gap-4 rounded border-2 border-dashed p-4 transition-colors ${
            isDragging ? "border-accent bg-accent/5" : "border-foreground/20 hover:border-foreground/40"
          }`}
        >
          {preview ? (
            <div className="w-full max-w-72">
              <div className="relative aspect-380/525 w-full overflow-hidden rounded border border-foreground/10 bg-foreground/5">
                {/* next/image는 blob 미리보기 URL을 지원하지 않아 일반 img를 사용한다. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={preview} alt="미리보기" className="h-full w-full object-cover" />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 py-10 text-center text-foreground/50">
              <UploadIcon className="h-6 w-6" />
              <p className="text-sm">이미지를 드래그하거나 클릭해서 선택하세요</p>
            </div>
          )}

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              sourceInputRef.current?.click();
            }}
            className="rounded border border-foreground/20 px-3 py-1.5 text-sm font-medium hover:bg-foreground/5"
          >
            {preview ? "사진 변경" : "사진 선택"}
          </button>
        </div>
      )}

      {cropping && originalSrc && (
        <div className="flex flex-col gap-3 rounded border border-foreground/15 p-3">
          <p className="text-sm font-medium">사진 영역을 선택해주세요</p>

          <div className="relative h-80 w-full overflow-hidden rounded bg-black">
            <Cropper
              image={originalSrc}
              crop={crop}
              zoom={zoom}
              aspect={IMAGE_ASPECT}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={(_, areaPixels) => setArea(areaPixels)}
            />
          </div>

          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                setCropping(false);
                setOriginalSrc(null);
              }}
              className="text-sm text-foreground/50 hover:text-foreground"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={!area}
              className="rounded bg-accent px-3 py-1.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
            >
              완료
            </button>
          </div>
        </div>
      )}

      <input
        ref={sourceInputRef}
        type="file"
        accept="image/*"
        onChange={handleSourceSelected}
        className="hidden"
      />
      <input ref={fileInputRef} name="image" type="file" accept="image/*" className="hidden" />

      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

function setFormFile(input: HTMLInputElement | null, blob: Blob, filename: string) {
  if (!input) return;
  const file = new File([blob], filename, { type: blob.type || "image/jpeg" });
  const dataTransfer = new DataTransfer();
  dataTransfer.items.add(file);
  input.files = dataTransfer.files;
}

async function cropToBlob(imageSrc: string, area: Area): Promise<Blob> {
  const image = await loadImage(imageSrc);
  const scale = area.width > MAX_OUTPUT_WIDTH ? MAX_OUTPUT_WIDTH / area.width : 1;

  const canvas = document.createElement("canvas");
  canvas.width = Math.round(area.width * scale);
  canvas.height = Math.round(area.height * scale);

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("캔버스를 생성할 수 없습니다.");

  // react-easy-crop이 넘기는 영역이 반올림 오차로 원본 이미지 경계를 살짝 벗어날 수 있다.
  // 이 경우 drawImage가 벗어난 부분을 그리지 않아 캔버스의 기본 배경(투명 → JPEG 변환 시 검정)이
  // 그대로 남아 테두리에 검은 선이 생기므로, 소스 영역을 이미지 실제 크기 안으로 고정한다.
  const sx = Math.min(Math.max(area.x, 0), image.naturalWidth);
  const sy = Math.min(Math.max(area.y, 0), image.naturalHeight);
  const sw = Math.min(area.width, image.naturalWidth - sx);
  const sh = Math.min(area.height, image.naturalHeight - sy);

  ctx.drawImage(image, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("이미지 생성에 실패했습니다."))),
      "image/jpeg",
      0.88,
    );
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("이미지를 불러오지 못했습니다."));
    image.src = src;
  });
}
