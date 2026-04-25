import React, { useRef, useEffect, useCallback } from 'react';
import { Anchor, Typography } from 'antd';
import type { AnchorProps } from 'antd';
import type { SdAnchorProps, SdAnchorItem, SdAnchorSectionProps } from './anchor.models';

function toAntItems(items: SdAnchorItem[]): AnchorProps['items'] {
  return items.map((item) => ({
    key: item.id,
    href: `#${item.id}`,
    title: item.title,
    children: item.children?.map((c) => ({
      key: c.id,
      href: `#${c.id}`,
      title: c.title,
    })),
  }));
}

export const SdAnchor: React.FC<SdAnchorProps> = ({
  items,
  direction = 'vertical',
  sidebarWidth = 200,
  ellipsis = false,
  affix = false,
  offsetTop = 16,
  containerHeight,
  className,
  style,
  children,
  onActiveChange,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleChange = useCallback(
    (link: string) => {
      const id = link.replace('#', '');
      onActiveChange?.(id);
    },
    [onActiveChange],
  );

  // IntersectionObserver for active tracking inside custom container
  useEffect(() => {
    if (!scrollContainerRef.current || !onActiveChange) return;
    const container = scrollContainerRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          onActiveChange(visible[0].target.id);
        }
      },
      { root: container, threshold: 0.2 },
    );

    const allIds = items.flatMap((i) => [i.id, ...(i.children?.map((c) => c.id) ?? [])]);
    allIds.forEach((id) => {
      const el = container.querySelector(`#${id}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items, onActiveChange]);

  const sidebar = (
    <div
      style={{
        width: sidebarWidth,
        flexShrink: 0,
        position: 'sticky',
        top: offsetTop,
        alignSelf: 'flex-start',
      }}
    >
      <Anchor
        affix={affix}
        offsetTop={offsetTop}
        direction={direction}
        getContainer={() => scrollContainerRef.current ?? window}
        items={toAntItems(items)}
        onChange={handleChange}
        style={{ maxWidth: ellipsis ? sidebarWidth : undefined }}
      />
    </div>
  );

  if (direction === 'horizontal') {
    return (
      <div className={className} style={style}>
        <div style={{ marginBottom: 8 }}>
          <Anchor
            direction="horizontal"
            affix={affix}
            items={toAntItems(items)}
            onChange={handleChange}
          />
        </div>
        <div
          ref={scrollContainerRef}
          style={{ overflowY: containerHeight ? 'auto' : undefined, maxHeight: containerHeight }}
        >
          {children}
        </div>
      </div>
    );
  }

  return (
    <div
      className={className}
      style={{ display: 'flex', gap: 16, alignItems: 'flex-start', ...style }}
    >
      {sidebar}
      <div
        ref={scrollContainerRef}
        style={{
          flex: 1,
          overflow: 'auto',
          maxHeight: containerHeight,
          paddingRight: 4,
        }}
      >
        {children}
      </div>
    </div>
  );
};

export const SdAnchorSection: React.FC<SdAnchorSectionProps> = ({
  id,
  title,
  titleLevel = 4,
  className,
  style,
  children,
}) => {
  return (
    <section
      id={id}
      className={className}
      style={{ scrollMarginTop: 16, marginBottom: 32, ...style }}
    >
      {title && (
        <Typography.Title level={titleLevel} style={{ marginTop: 0 }}>
          {title}
        </Typography.Title>
      )}
      {children}
    </section>
  );
};
