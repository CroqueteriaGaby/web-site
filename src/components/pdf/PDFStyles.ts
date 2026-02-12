import { StyleSheet } from '@react-pdf/renderer';

export const colors = {
  primary: '#FF6B6B',
  textDark: '#654321',
  textGray: '#636E72',
  bgCream: '#FFFDF7',
  bgWarm: '#f5e6d3',
  cardBg: '#FFFFFF',
  cardBorder: '#f0ebe3',
  lightPink: '#FFF0F0',
  white: '#FFFFFF',
  borderLight: '#eeeeee',
};

export const toSlug = (str: string): string =>
  str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

export const styles = StyleSheet.create({
  // Page
  page: {
    backgroundColor: colors.bgCream,
    paddingTop: 40,
    paddingBottom: 60,
    paddingHorizontal: 40,
    fontFamily: 'Helvetica',
  },

  // Cover Page
  coverPage: {
    backgroundColor: colors.bgCream,
    paddingHorizontal: 40,
    fontFamily: 'Helvetica',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  coverLogo: {
    width: 180,
    height: 180,
    marginBottom: 30,
  },
  coverTitle: {
    fontSize: 32,
    fontFamily: 'Helvetica-Bold',
    color: colors.textDark,
    marginBottom: 10,
    textAlign: 'center',
  },
  coverSubtitle: {
    fontSize: 20,
    color: colors.primary,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  coverDate: {
    fontSize: 12,
    color: colors.textGray,
    marginTop: 20,
    textAlign: 'center',
  },
  coverDecorativeLine: {
    width: 80,
    height: 3,
    backgroundColor: colors.primary,
    marginVertical: 20,
    borderRadius: 2,
  },

  // Table of Contents
  tocTitle: {
    fontSize: 24,
    fontFamily: 'Helvetica-Bold',
    color: colors.textDark,
    marginBottom: 30,
    textAlign: 'center',
  },
  tocRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: colors.lightPink,
    borderRadius: 8,
  },
  tocCategoryName: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: colors.primary,
  },
  tocBrandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    paddingLeft: 24,
  },
  tocBrandName: {
    fontSize: 10,
    color: colors.textGray,
  },
  tocSectionDivider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: 10,
  },

  // Category Section
  categoryBanner: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 20,
    marginTop: 10,
  },
  categoryTitle: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    color: colors.white,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  brandTitle: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: colors.textDark,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 16,
    marginBottom: 6,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  breedTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: colors.textGray,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 10,
    marginBottom: 8,
  },

  // Product Grid
  productsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },

  // Product Card
  productCard: {
    width: '31%',
    backgroundColor: colors.cardBg,
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: 12,
    alignItems: 'center',
  },
  productImageContainer: {
    width: 100,
    height: 100,
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productImage: {
    maxWidth: 100,
    maxHeight: 100,
    objectFit: 'contain',
  },
  productName: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: colors.textDark,
    textAlign: 'center',
    marginBottom: 4,
    maxLines: 2,
  },
  productWeight: {
    fontSize: 8,
    color: colors.textGray,
    textAlign: 'center',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: colors.primary,
    textAlign: 'center',
  },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.primary,
    paddingTop: 8,
  },
  footerText: {
    fontSize: 8,
    color: colors.textGray,
  },
  footerPaw: {
    fontSize: 10,
    color: colors.primary,
  },
});
